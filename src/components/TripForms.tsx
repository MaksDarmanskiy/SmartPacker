import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Radio, 
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox,
  Paper
} from '@mui/material';
import type { TripFormData, LocationType, Activity } from '../types/types';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
}

interface LocationTypeOption {
  value: LocationType;
  label: string;
}

interface ActivityOption {
  value: Activity;
  label: string;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TripFormData>({
    location: '',
    locationType: '' as LocationType,
    startDate: '',
    endDate: '',
    days: 1,
    activities: []
  });

  const locationTypes: LocationTypeOption[] = [
    { value: 'mountains', label: '🏔️ Гори' },
    { value: 'sea', label: '🏖️ Море' },
    { value: 'city', label: '🏙️ Місто' },
    { value: 'camping', label: '🏕️ Кемпінг' }
  ];

  const activities: ActivityOption[] = [
    { value: 'skiing', label: '⛷️ Лижі' },
    { value: 'swimming', label: '🏊 Плавання' },
    { value: 'hiking', label: '🥾 Пішохідні походи' },
    { value: 'work', label: '💼 Робота' },
    { value: 'party', label: '🎉 Вечірки' },
    { value: 'beach', label: '🏖️ Пляж' },
    { value: 'sightseeing', label: '📸 Екскурсії' }
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActivityToggle = (activityValue: Activity): void => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activityValue)
        ? prev.activities.filter(a => a !== activityValue)
        : [...prev.activities, activityValue]
    }));
  };

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 1;
    const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    if (name === 'startDate' || name === 'endDate') {
      if (newFormData.startDate && newFormData.endDate) {
        newFormData.days = calculateDays(newFormData.startDate, newFormData.endDate);
      }
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getDaysLabel = (days: number): string => {
    if (days === 1) return 'день';
    if (days < 5) return 'дні';
    return 'днів';
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '42rem',
        mx: 'auto',
        p: 4
      }}
    >
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#111827',
          border: '1px solid #1f2937',
          borderRadius: 2,
          p: 4
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            pb: 3,
            borderBottom: '1px solid #1f2937'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 300,
              color: 'white',
              mb: 1
            }}
          >
            SmartPacker
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#9ca3af'
            }}
          >
            Створіть ідеальний список речей для вашої подорожі
          </Typography>
        </Box>

        {/* Локація */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 500,
              mb: 1
            }}
          >
            Куди їдете?
          </Typography>
          <TextField
            fullWidth
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Наприклад: Карпати, Буковель"
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                bgcolor: '#1f2937',
                '& fieldset': {
                  borderColor: '#374151',
                },
                '&:hover fieldset': {
                  borderColor: '#4b5563',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#6b7280',
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Тип локації */}
        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel
            sx={{
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
              fontWeight: 500,
              mb: 1.5,
              '&.Mui-focused': {
                color: '#9ca3af',
              },
            }}
          >
            Тип місця
          </FormLabel>
          <RadioGroup
            name="locationType"
            value={formData.locationType}
            onChange={handleChange}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5
            }}
          >
            {locationTypes.map(type => (
              <FormControlLabel
                key={type.value}
                value={type.value}
                control={
                  <Radio
                    sx={{
                      display: 'none'
                    }}
                  />
                }
                label={type.label}
                sx={{
                  m: 0,
                  px: 2,
                  py: 1.5,
                  border: '1px solid',
                  borderColor: formData.locationType === type.value ? '#3b82f6' : '#374151',
                  bgcolor: formData.locationType === type.value ? 'rgba(59, 130, 246, 0.1)' : 'rgba(31, 41, 55, 0.5)',
                  color: formData.locationType === type.value ? '#60a5fa' : '#d1d5db',
                  borderRadius: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: formData.locationType === type.value ? '#3b82f6' : '#4b5563',
                  },
                  '& .MuiFormControlLabel-label': {
                    width: '100%',
                    fontSize: '0.875rem'
                  }
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Дати */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            mb: 3
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 500,
                mb: 1
              }}
            >
              Дата початку
            </Typography>
            <TextField
              fullWidth
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleDateChange}
              inputProps={{ min: new Date().toISOString().split('T')[0] }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: '#1f2937',
                  '& fieldset': {
                    borderColor: '#374151',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4b5563',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                  },
                },
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 500,
                mb: 1
              }}
            >
              Дата завершення
            </Typography>
            <TextField
              fullWidth
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleDateChange}
              inputProps={{ min: formData.startDate || new Date().toISOString().split('T')[0] }}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: '#1f2937',
                  '& fieldset': {
                    borderColor: '#374151',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4b5563',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                  },
                },
              }}
            />
          </Box>
        </Box>

        {/* Тривалість */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: 'rgba(31, 41, 55, 0.5)',
            border: '1px solid #374151',
            borderRadius: 1
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#d1d5db'
            }}
          >
            <Box component="span" sx={{ color: '#9ca3af' }}>
              Тривалість подорожі:
            </Box>
            <Box component="span" sx={{ color: '#60a5fa', fontWeight: 500, ml: 1 }}>
              {formData.days} {getDaysLabel(formData.days)}
            </Box>
          </Typography>
        </Box>

        {/* Активності */}
        <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
          <FormLabel
            sx={{
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
              fontWeight: 500,
              mb: 1.5,
              '&.Mui-focused': {
                color: '#9ca3af',
              },
            }}
          >
            Чим плануєте займатися?
          </FormLabel>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5
            }}
          >
            {activities.map(activity => (
              <FormControlLabel
                key={activity.value}
                control={
                  <Checkbox
                    checked={formData.activities.includes(activity.value)}
                    onChange={() => handleActivityToggle(activity.value)}
                    sx={{
                      color: '#10b981',
                      '&.Mui-checked': {
                        color: '#10b981',
                      },
                    }}
                  />
                }
                label={activity.label}
                sx={{
                  m: 0,
                  px: 2,
                  py: 1.5,
                  border: '1px solid',
                  borderColor: formData.activities.includes(activity.value) ? '#10b981' : '#374151',
                  bgcolor: formData.activities.includes(activity.value) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(31, 41, 55, 0.5)',
                  color: formData.activities.includes(activity.value) ? '#34d399' : '#d1d5db',
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: formData.activities.includes(activity.value) ? '#10b981' : '#4b5563',
                  },
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                    ml: 0.5
                  }
                }}
              />
            ))}
          </Box>
        </FormControl>

        {/* Кнопка відправки */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            bgcolor: '#2563eb',
            color: 'white',
            fontWeight: 500,
            py: 1.75,
            borderRadius: 1,
            textTransform: 'none',
            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)',
            '&:hover': {
              bgcolor: '#3b82f6',
              boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
            },
          }}
        >
          Згенерувати список речей →
        </Button>
      </Paper>
    </Box>
  );
};

export default TripForm;