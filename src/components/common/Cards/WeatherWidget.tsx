import { Droplets } from 'lucide-react';
import type { WeatherData } from '../../../types/dashboard.types';

interface WeatherWidgetProps {
  weather: WeatherData;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  const { current, forecast } = weather;

  return (
    <div className="card p-6 overflow-hidden animate-fade-in relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/20 opacity-50" />

      {/* Header */}
      <div className="relative">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
          Clima Actual
        </h3>
        <p className="text-xs text-gray-500">Condiciones en tiempo real</p>
      </div>

      {/* Current weather with enhanced styling */}
      <div className="relative flex items-start justify-between mb-8 mt-6">
        <div className="flex-1">
          {/* Temperature with gradient */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-6xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter leading-none">
              {current.temperature}
            </span>
            <span className="text-3xl font-semibold text-gray-400">°C</span>
          </div>

          {/* Condition */}
          <p className="text-base font-semibold text-gray-700 mb-4">
            {current.condition}
          </p>

          {/* Weather details with icons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/80 rounded-lg ring-1 ring-blue-100">
              <Droplets className="w-4 h-4 text-blue-500" strokeWidth={2.5} />
              <span className="text-sm font-semibold text-blue-700">
                {current.humidity}%
              </span>
            </div>
          </div>
        </div>

        {/* Animated weather icon */}
        <div className="relative">
          <div className="text-7xl animate-float drop-shadow-lg">
            {current.icon}
          </div>
          {/* Glow effect behind icon */}
          <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-br from-blue-400 to-cyan-400 -z-10" />
        </div>
      </div>

      {/* Forecast section with improved design */}
      <div className="relative border-t border-gray-100/80 pt-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
          Próximos días
        </p>
        <div className="grid grid-cols-4 gap-3">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="group relative text-center p-3 rounded-xl bg-gradient-to-b from-gray-50/50 to-transparent hover:from-gray-50 hover:to-gray-50/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
            >
              {/* Day label */}
              <p className="text-xs font-bold text-gray-500 mb-3 group-hover:text-gray-700 transition-colors">
                {day.day}
              </p>

              {/* Icon with scale animation */}
              <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">
                {day.icon}
              </div>

              {/* Temperatures */}
              <div className="space-y-1">
                <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {day.tempHigh}°
                </p>
                <p className="text-xs font-semibold text-gray-400">
                  {day.tempLow}°
                </p>
              </div>

              {/* Hover indicator */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sky-100 to-blue-100 rounded-full blur-3xl opacity-20 -z-10" />
    </div>
  );
}
