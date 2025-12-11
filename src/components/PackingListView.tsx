import React, { useState } from 'react'; 
import type { FC } from 'react'; 
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Checkbox,
  LinearProgress,
  Chip
} from '@mui/material';
import { calculateProgress } from '../utils/packingGenerator'; 
import type { GeneratedData, GeneratedPackingList, PackingItem } from '../types/types'; 

interface PackingListViewProps {
  data: GeneratedData;
  onReset: () => void;
}

const PackingListView: FC<PackingListViewProps> = ({ data, onReset }) => { 
  const [packingList, setPackingList] = useState<GeneratedPackingList>(data.packingList);
  const { weather, tripInfo } = data;
  
  const progress = calculateProgress(packingList);

  const toggleItem = (categoryKey: string, itemId: string): void => {
    setPackingList(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        items: prev[categoryKey].items.map(item =>
          item.id === itemId ? { ...item, packed: !item.packed } : item
        )
      }
    } as GeneratedPackingList));
  };

  const addCustomItem = (categoryKey: string): void => {
    const customName = prompt('Введіть назву речі:');
    if (!customName) return;

    const newItem: PackingItem & { packed: boolean; quantity: number } = {
      id: `custom_${Date.now()}`,
      name: customName,
      essential: false,
      packed: false,
      custom: true,
      quantity: 1
    };

    setPackingList(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        items: [...prev[categoryKey].items, newItem]
      }
    } as GeneratedPackingList));
  };

  const getDaysLabel = (days: number): string => {
    if (days === 1) return 'день';
    if (days < 5) return 'дні';
    return 'днів';
  };

  return (
    <Box sx={{ maxWidth: '64rem', mx: 'auto', p: 3 }}>
      {/* Головна картка з прогресом */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#111827',
          border: '1px solid #1f2937',
          borderRadius: 2,
          p: 4,
          mb: 3
        }}
      >
        {/* Заголовок */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 300, color: 'white' }}>
            🎒 Ваш список речей
          </Typography>
          <Button
            onClick={onReset}
            sx={{
              bgcolor: '#374151',
              color: 'white',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1,
              borderRadius: 1,
              '&:hover': {
                bgcolor: '#4b5563',
              },
            }}
          >
            ← Нова подорож
          </Button>
        </Box>

        {/* Інфо про подорож */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 1,
            p: 2.5,
            mb: 3
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#60a5fa', mb: 0.5 }}>
            📍 {tripInfo.location}
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            {tripInfo.days} {getDaysLabel(tripInfo.days)}
            {tripInfo.activities.length > 0 && ` · ${tripInfo.activities.length} активностей`}
          </Typography>
        </Paper>

        {/* Погода */}
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 1,
            p: 3,
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Прогноз погоди
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', my: 0.5 }}>
                {weather.conditionInfo.icon} {weather.temp}°C
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                {weather.conditionInfo.name}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', maxWidth: '200px' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#d1d5db', mb: 0.5 }}>
                {weather.tempCategory}
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                {weather.recommendation}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ pt: 2, borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Typography variant="body2" sx={{ color: '#60a5fa' }}>
              💡 <strong>Порада:</strong> {weather.conditionInfo.packingTip}
            </Typography>
          </Box>
        </Paper>

        {/* Прогрес-бар */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              Прогрес зборів
            </Typography>
            <Typography variant="body2" sx={{ color: '#d1d5db', fontWeight: 600 }}>
              {progress.packed} / {progress.total}
            </Typography>
          </Box>
          <Box sx={{ position: 'relative', height: 16, bgcolor: '#1f2937', borderRadius: 2, overflow: 'hidden' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progress.percentage}%`,
                bgcolor: '#10b981',
                borderRadius: 2,
                transition: 'width 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                pr: 1
              }}
            >
              {progress.percentage > 10 && (
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>
                  {progress.percentage}%
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Список по категоріях */}
      {Object.entries(packingList).map(([categoryKey, category]) => (
        <Paper
          key={categoryKey}
          elevation={0}
          sx={{
            bgcolor: '#111827',
            border: '1px solid #1f2937',
            borderRadius: 2,
            p: 3,
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: 'white' }}>
              {category.name}
            </Typography>
            <Button
              onClick={() => addCustomItem(categoryKey)}
              sx={{
                color: '#60a5fa',
                textTransform: 'none',
                fontSize: '0.875rem',
                minWidth: 'auto',
                p: 0,
                '&:hover': {
                  color: '#93c5fd',
                  bgcolor: 'transparent'
                },
              }}
            >
              + Додати
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {category.items.map(item => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: item.packed ? 'rgba(16, 185, 129, 0.4)' : '#374151',
                  bgcolor: item.packed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(31, 41, 55, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: item.packed ? 'rgba(16, 185, 129, 0.6)' : '#4b5563',
                  },
                }}
                onClick={() => toggleItem(categoryKey, item.id)}
              >
                <Checkbox
                  checked={item.packed}
                  sx={{
                    color: '#10b981',
                    mr: 1.5,
                    '&.Mui-checked': {
                      color: '#10b981',
                    },
                  }}
                />
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    sx={{
                      color: item.packed ? '#9ca3af' : '#d1d5db',
                      textDecoration: item.packed ? 'line-through' : 'none',
                    }}
                  >
                    {item.name}
                  </Typography>
                  {typeof item.quantity === 'number' && item.quantity > 1 && (
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      x{item.quantity}
                    </Typography>
                  )}
                  {item.essential && (
                    <Chip
                      label="Обов'язково"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        fontSize: '0.7rem',
                        height: 22,
                        borderRadius: 0.5
                      }}
                    />
                  )}
                  {item.custom && (
                    <Chip
                      label="Власне"
                      size="small"
                      sx={{
                        bgcolor: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        fontSize: '0.7rem',
                        height: 22,
                        borderRadius: 0.5
                      }}
                    />
                  )}
                </Box>
                {item.packed && (
                  <Typography sx={{ color: '#10b981', fontSize: '1.25rem' }}>✓</Typography>
                )}
              </Paper>
            ))}
          </Box>
        </Paper>
      ))}

      {/* Чек-лист перед виходом */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.4)',
          borderRadius: 2,
          p: 3
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#fbbf24', mb: 2.5 }}>
          ⚠️ Перед виходом
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[
            { icon: '🔌', text: 'Вимкнути прилади з розеток' },
            { icon: '🔥', text: 'Перевірити газ та плиту' },
            { icon: '🚪', text: 'Закрити всі вікна та двері' },
            { icon: '💡', text: 'Вимкнути світло' },
            { icon: '🗑️', text: 'Винести сміття' }
          ].map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography sx={{ mr: 1.5, fontSize: '1.1rem' }}>{item.icon}</Typography>
              <Typography sx={{ color: '#d1d5db', lineHeight: 1.6 }}>{item.text}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default PackingListView;