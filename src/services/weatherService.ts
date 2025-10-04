import { WeatherData } from '../lib/supabase';

export interface WeatherForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  tempAvg: number;
  feelsLikeMax: number;
  feelsLikeMin: number;
  windSpeedMax: number;
  precipitationTotal: number;
  humidityAvg: number;
  description: string;
}

export class WeatherService {
  private static readonly OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';

  static async getForecast(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string
  ): Promise<WeatherForecast[]> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        start_date: startDate,
        end_date: endDate,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'apparent_temperature_max',
          'apparent_temperature_min',
          'precipitation_sum',
          'wind_speed_10m_max',
          'relative_humidity_2m_max',
          'weathercode'
        ].join(','),
        timezone: 'auto'
      });

      const response = await fetch(`${this.OPEN_METEO_BASE}/forecast?${params}`);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  }

  static async getHistoricalData(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string
  ): Promise<WeatherForecast[]> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        start_date: startDate,
        end_date: endDate,
        daily: [
          'temperature_2m_max',
          'temperature_2m_min',
          'apparent_temperature_max',
          'apparent_temperature_min',
          'precipitation_sum',
          'wind_speed_10m_max',
          'relative_humidity_2m_max',
          'weathercode'
        ].join(','),
        timezone: 'auto'
      });

      const response = await fetch(`${this.OPEN_METEO_BASE}/archive?${params}`);

      if (!response.ok) {
        throw new Error(`Historical weather API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseWeatherData(data);
    } catch (error) {
      console.error('Error fetching historical weather data:', error);
      throw error;
    }
  }

  private static parseWeatherData(data: any): WeatherForecast[] {
    const forecasts: WeatherForecast[] = [];
    const daily = data.daily;

    for (let i = 0; i < daily.time.length; i++) {
      forecasts.push({
        date: daily.time[i],
        tempMax: daily.temperature_2m_max[i] || 0,
        tempMin: daily.temperature_2m_min[i] || 0,
        tempAvg: (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2 || 0,
        feelsLikeMax: daily.apparent_temperature_max[i] || 0,
        feelsLikeMin: daily.apparent_temperature_min[i] || 0,
        windSpeedMax: daily.wind_speed_10m_max[i] || 0,
        precipitationTotal: daily.precipitation_sum[i] || 0,
        humidityAvg: daily.relative_humidity_2m_max[i] || 0,
        description: this.getWeatherDescription(daily.weathercode[i])
      });
    }

    return forecasts;
  }

  private static getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };

    return weatherCodes[code] || 'Unknown';
  }

  static async geocodeLocation(locationName: string): Promise<{ lat: number; lon: number; name: string; country: string } | null> {
    try {
      const params = new URLSearchParams({
        name: locationName,
        count: '1',
        language: 'en',
        format: 'json'
      });

      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return null;
      }

      const result = data.results[0];
      return {
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        country: result.country || ''
      };
    } catch (error) {
      console.error('Error geocoding location:', error);
      return null;
    }
  }
}
