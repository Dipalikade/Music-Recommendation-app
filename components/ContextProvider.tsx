import React from 'react';
import { Platform, Weather, PLATFORMS, WEATHER_OPTIONS } from '../types';
import { MusicPlatformIcon, WeatherIcon, LocationMarkerIcon } from './IconComponents';

interface ContextProviderProps {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
  weather: Weather;
  setWeather: (weather: Weather) => void;
  timeOfDay: string;
  isWeatherAuto: boolean;
  isWeatherLoading: boolean;
  weatherError: string | null;
  onFetchWeather: () => void;
  switchToManualWeather: () => void;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({ 
  platform, setPlatform, 
  weather, setWeather, 
  timeOfDay,
  isWeatherAuto, isWeatherLoading, weatherError, onFetchWeather, switchToManualWeather
}) => {
  const renderWeatherContent = () => {
    if (isWeatherLoading) {
      return (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-gray-400"></div>
          <span>Detecting weather...</span>
        </div>
      );
    }

    if (isWeatherAuto && !weatherError) {
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WeatherIcon weather={weather} />
            <span className="font-medium text-white">{weather}</span>
            <span className="text-gray-400 text-xs">(Auto)</span>
          </div>
          <button onClick={switchToManualWeather} className="text-xs text-purple-400 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
            Change
          </button>
        </div>
      );
    }

    // Manual selection mode (handles both user choice and errors)
    return (
      <div>
        {weatherError && (
          <p className="text-xs text-yellow-500 mb-2">
            Couldn't automatically detect weather. Please select it manually.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {WEATHER_OPTIONS.map(w => (
            <ContextButton key={w} value={w} selectedValue={weather} onClick={setWeather}>
              <WeatherIcon weather={w} />
              <span>{w}</span>
            </ContextButton>
          ))}
        </div>
        <button 
          onClick={onFetchWeather} 
          className="text-xs text-purple-400 hover:underline mt-2 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
          aria-label="Detect weather automatically"
        >
          <LocationMarkerIcon />
          Detect Automatically
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-800 border-b border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2">MUSIC PLATFORM</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(p => (
              <ContextButton key={p} value={p} selectedValue={platform} onClick={setPlatform}>
                <MusicPlatformIcon platform={p} />
                <span>{p}</span>
              </ContextButton>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-2">CURRENT WEATHER</label>
          {renderWeatherContent()}
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-4">
        Time of Day: <span className="font-semibold text-gray-400">{timeOfDay}</span>. Context helps tailor your recommendations.
      </p>
    </div>
  );
};

interface ContextButtonProps<T extends string> {
    value: T;
    selectedValue: T;
    onClick: (value: T) => void;
    children: React.ReactNode;
}

const ContextButton = <T extends string,>({ value, selectedValue, onClick, children }: ContextButtonProps<T>) => {
    const isSelected = value === selectedValue;
    const baseClasses = "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800";
    const selectedClasses = "bg-purple-600 text-white shadow-md";
    const unselectedClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

    return (
        <button onClick={() => onClick(value)} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
            {children}
        </button>
    );
};