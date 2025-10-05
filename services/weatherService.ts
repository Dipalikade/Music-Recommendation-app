
import { Weather } from '../types';

/**
 * Maps WMO weather codes from the Open-Meteo API to the simplified Weather types used in the app.
 * @param code The WMO weather code number.
 * @returns A Weather string ('Sunny', 'Cloudy', 'Rainy', 'Snowy').
 */
const mapWeatherCodeToWeather = (code: number): Weather => {
  if (code === 0) return 'Sunny';
  if ([1, 2, 3, 45, 48].includes(code)) return 'Cloudy';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowy';
  // Most other precipitation codes can be broadly categorized as Rainy.
  if (code >= 51 && code <= 99) return 'Rainy';
  
  // Default to Sunny for any other unexpected codes.
  return 'Sunny'; 
};

/**
 * Fetches the user's current location and then retrieves the current weather for that location.
 * @returns A Promise that resolves with the detected Weather type.
 * @rejects An error if geolocation is not supported, permission is denied, or the API call fails.
 */
export const fetchWeatherByLocation = async (): Promise<Weather> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using Open-Meteo, a free weather API that doesn't require an API key.
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code`);
          if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
          }
          const data = await response.json();
          const weatherCode = data?.current?.weather_code;
          
          if (typeof weatherCode !== 'number') {
            throw new Error('Invalid weather data received from the server.');
          }
          resolve(mapWeatherCodeToWeather(weatherCode));
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        // Handle different geolocation errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location access was denied."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("The request to get your location timed out."));
            break;
          default:
            reject(new Error("An unknown error occurred while getting location."));
            break;
        }
      }
    );
  });
};
