import { Droplets } from 'lucide-react';
import type { WeatherData } from '../../../types/dashboard.types';

interface WeatherWidgetProps {
  weather: WeatherData;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  const { current, forecast } = weather;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Clima Actual</h3>

      {/* Current Weather */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-5xl font-bold text-gray-900">
            {current.temperature}°C
          </div>
          <p className="text-sm text-gray-600 mt-2">{current.condition}</p>
          <div className="flex items-center gap-2 mt-3">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">Humedad: {current.humidity}%</span>
          </div>
        </div>
        <div className="text-5xl">{current.icon}</div>
      </div>

      {/* Forecast */}
      <div className="border-t border-gray-100 pt-4">
        <div className="grid grid-cols-4 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-500 mb-2">{day.day}</p>
              <div className="text-2xl mb-2">{day.icon}</div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">{day.tempHigh}°</p>
                <p className="text-xs text-gray-500">{day.tempLow}°</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
