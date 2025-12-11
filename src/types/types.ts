// Типи для форми подорожі
export type LocationType = 'mountains' | 'sea' | 'city' | 'camping';

export type Activity = 'skiing' | 'swimming' | 'hiking' | 'work' | 'party' | 'beach' | 'sightseeing';

export interface TripFormData {
  location: string;
  locationType: LocationType;
  startDate: string;
  endDate: string;
  days: number;
  activities: Activity[];
}

// Типи для речей
export interface ItemConditions {
  minDays?: number;
  locationType?: LocationType[];
  activities?: Activity[];
  weather?: WeatherCategory;
}

export interface PackingItem {
  id: string;
  name: string;
  essential: boolean;
  conditions?: ItemConditions;
  quantity?: number | 'days' | 'half_days'; // Увага: quantity тут опціональний і може бути string
  packed?: boolean;
  custom?: boolean;
}

export interface PackingCategory {
  name: string;
  items: PackingItem[];
}

// Увага: Цей тип гарантує, що після генерації quantity буде числом!
export interface GeneratedPackingList {
  [categoryKey: string]: PackingCategory & {
    items: (PackingItem & { packed: boolean; quantity: number })[];
  };
}

// Типи для погоди
export type WeatherCondition = 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'snowy';
export type Season = 'winter' | 'spring' | 'summer' | 'autumn';
export type WeatherCategory = 'cold' | 'cool' | 'mild' | 'warm' | 'hot';

export interface WeatherInfo {
  temp: number;
  condition: WeatherCondition;
  humidity?: number;
  windSpeed?: number;
  description: string;
  season?: Season;
}

export interface WeatherConditionInfo {
  icon: string;
  name: string;
  packingTip: string;
}

export interface TemperatureRange {
  min?: number;
  max?: number;
  label: string;
  recommendation: string;
}

export interface WeatherData {
  mockWeatherData: {
    [location: string]: {
      location: string;
      winter: WeatherInfo;
      spring: WeatherInfo;
      summer: WeatherInfo;
      autumn: WeatherInfo;
    };
  };
  weatherConditions: {
    [key in WeatherCondition]: WeatherConditionInfo;
  };
  temperatureRanges: {
    [key: string]: TemperatureRange;
  };
}

// Типи для генерованого списку
export interface GeneratedWeather extends WeatherInfo {
  tempCategory: string;
  recommendation: string;
  conditionInfo: WeatherConditionInfo;
}

export interface GeneratedData {
  packingList: GeneratedPackingList;
  weather: GeneratedWeather;
  tripInfo: TripFormData;
}

// Типи для прогресу
export interface Progress {
  total: number;
  packed: number;
  percentage: number;
}

// Типи для контексту генерації
export interface GenerationContext {
  locationType: LocationType;
  days: number;
  activities: Activity[];
  weather: WeatherCategory;
  temperature: number;
  weatherCondition: WeatherCondition;
}