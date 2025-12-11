import * as packingData from '../data/packingData.json';
import * as weatherData from '../data/weatherMockData.json';

// 2. ВИПРАВЛЕНО: Використання 'import type' та коректний шлях
import type {
  TripFormData,
  Season,
  WeatherInfo,
  WeatherCategory,
  PackingItem,
  GenerationContext,
  GeneratedData,
  GeneratedPackingList,
  Progress,
  WeatherData, // Додано для типізації weatherData
  PackingCategory // Додано для типізації packingData
} from '../types/types'; // Коректний шлях '../types/types'

/**
 * Визначає сезон на основі дати
 */
const getSeason = (date: string): Season => {
  // Виправлено: getMonth() повертає 0-11.
  const month = new Date(date).getMonth();
  if (month >= 2 && month <= 4) return 'spring'; // Березень (2) - Травень (4)
  if (month >= 5 && month <= 7) return 'summer'; // Червень (5) - Серпень (7)
  if (month >= 8 && month <= 10) return 'autumn'; // Вересень (8) - Листопад (10)
  return 'winter'; // Грудень (11), Січень (0), Лютий (1)
};

/**
 * Отримує погоду для локації (мок-дані)
 */
const getWeatherForLocation = (location: string, startDate: string): WeatherInfo & { season: Season } => {
  const season = getSeason(startDate);
  const locationKey = location.toLowerCase();
  
  // Явне приведення типу для weatherData
  const typedWeatherData = weatherData as unknown as WeatherData;

  // Пошук найближчої локації в базі
  const availableLocations = Object.keys(typedWeatherData.mockWeatherData);
  const matchedLocation = availableLocations.find(loc => 
    locationKey.includes(loc.toLowerCase()) || loc.toLowerCase().includes(locationKey)
  );

  if (matchedLocation) {
    const locationData = typedWeatherData.mockWeatherData[matchedLocation as keyof typeof typedWeatherData.mockWeatherData];
    return {
      ...locationData[season],
      season
    };
  }

  // Дефолтна погода за сезоном
  const defaultWeather: Record<Season, WeatherInfo> = {
    winter: { temp: -3, condition: 'snowy', description: 'Зимова погода' },
    spring: { temp: 12, condition: 'rainy', description: 'Весняна погода' },
    summer: { temp: 25, condition: 'sunny', description: 'Літня погода' },
    autumn: { temp: 10, condition: 'rainy', description: 'Осіння погода' }
  };

  return { ...defaultWeather[season], season };
};

/**
 * Визначає температурну категорію
 */
const getTemperatureCategory = (temp: number): { weather: WeatherCategory; label: string; recommendation: string } => {
  // Явне приведення типу для weatherData
  const typedWeatherData = weatherData as unknown as WeatherData;
  const ranges = typedWeatherData.temperatureRanges;
  
  // Логіка порівняння залишилася коректною
  if (temp <= (ranges.very_cold.max ?? -Infinity)) {
    return { weather: 'cold', label: ranges.very_cold.label, recommendation: ranges.very_cold.recommendation };
  }
  if (temp >= (ranges.cold.min ?? -Infinity) && temp <= (ranges.cold.max ?? Infinity)) {
    return { weather: 'cold', label: ranges.cold.label, recommendation: ranges.cold.recommendation };
  }
  if (temp >= (ranges.cool.min ?? -Infinity) && temp <= (ranges.cool.max ?? Infinity)) {
    return { weather: 'cool', label: ranges.cool.label, recommendation: ranges.cool.recommendation };
  }
  if (temp >= (ranges.mild.min ?? -Infinity) && temp <= (ranges.mild.max ?? Infinity)) {
    return { weather: 'mild', label: ranges.mild.label, recommendation: ranges.mild.recommendation };
  }
  if (temp >= (ranges.warm.min ?? -Infinity) && temp <= (ranges.warm.max ?? Infinity)) {
    return { weather: 'warm', label: ranges.warm.label, recommendation: ranges.warm.recommendation };
  }
  if (temp >= (ranges.hot.min ?? -Infinity)) {
    return { weather: 'hot', label: ranges.hot.label, recommendation: ranges.hot.recommendation };
  }
  
  return { weather: 'mild', label: ranges.mild.label, recommendation: ranges.mild.recommendation };
};

/**
 * Перевіряє чи відповідає річ умовам
 */
const itemMatchesConditions = (item: PackingItem, context: GenerationContext): boolean => {
  if (!item.conditions) return true;
  
  const { conditions } = item;
  
  // Перевірка мінімальної кількості днів
  if (conditions.minDays && context.days < conditions.minDays) {
    return false;
  }
  
  // Перевірка типу локації
  if (conditions.locationType && conditions.locationType.length > 0) {
    if (!conditions.locationType.includes(context.locationType)) {
      return false;
    }
  }
  
  // Перевірка активностей
  if (conditions.activities && conditions.activities.length > 0) {
    const hasMatchingActivity = conditions.activities.some(activity => 
      context.activities.includes(activity)
    );
    if (!hasMatchingActivity) {
      return false;
    }
  }
  
  // Перевірка погоди
  if (conditions.weather && conditions.weather !== context.weather) {
    return false;
  }
  
  return true;
};

/**
 * Розраховує кількість речей
 */
const calculateQuantity = (item: PackingItem, days: number): number => {
  if (item.quantity === 'days') return days;
  if (item.quantity === 'half_days') return Math.ceil(days / 2);
  
  // Якщо quantity не визначено або це 'days'/'half_days', повертаємо 1 (якщо це не було оброблено вище)
  if (typeof item.quantity === 'number') return item.quantity; 
  
  return 1;
};

/**
 * Головна функція генерації списку
 */
export const generatePackingList = (formData: TripFormData): GeneratedData => {
  const { location, locationType, startDate, days, activities } = formData;
  
  // Отримуємо погоду
  const weather = getWeatherForLocation(location, startDate);
  const tempCategory = getTemperatureCategory(weather.temp);
  
  // Контекст для перевірки умов
  const context: GenerationContext = {
    locationType,
    days,
    activities,
    weather: tempCategory.weather,
    temperature: weather.temp,
    weatherCondition: weather.condition
  };
  
  // Явне приведення типу для packingData
  const typedPackingData = packingData as unknown as { categories: Record<string, PackingCategory> };

  // Генеруємо список речей
  const packingList: GeneratedPackingList = {};
  
  Object.entries(typedPackingData.categories).forEach(([categoryKey, category]) => {
    const categoryItems = category.items
      .filter(item => itemMatchesConditions(item, context))
      .map(item => ({
        ...item,
        // ВИПРАВЛЕНО: Тип quantity гарантовано є number завдяки логіці calculateQuantity
        quantity: calculateQuantity(item, days), 
        packed: false
      }));
    
    if (categoryItems.length > 0) {
      packingList[categoryKey] = {
        name: category.name,
        // item має тип (PackingItem & { packed: boolean; quantity: number }), що відповідає GeneratedPackingList
        items: categoryItems as GeneratedPackingList[string]['items'] 
      };
    }
  });
  
  const typedWeatherData = weatherData as unknown as WeatherData;
  const conditionInfo = typedWeatherData.weatherConditions[weather.condition];
  
  return {
    packingList,
    weather: {
      ...weather,
      tempCategory: tempCategory.label,
      recommendation: tempCategory.recommendation,
      conditionInfo
    },
    tripInfo: formData
  };
};

/**
 * Підраховує прогрес зборів
 */
export const calculateProgress = (packingList: GeneratedPackingList): Progress => {
  let totalItems = 0;
  let packedItems = 0;
  
  Object.values(packingList).forEach(category => {
    category.items.forEach(item => {
      // ВИПРАВЛЕНО: Явне приведення item.quantity до number
      totalItems += item.quantity as number;
      if (item.packed) packedItems += item.quantity as number;
    });
  });
  
  return {
    total: totalItems,
    packed: packedItems,
    percentage: totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0
  };
};

// Залиште експорти функцій в кінці
export {};