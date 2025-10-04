import { RiskThresholds, RiskAssessment } from '../lib/supabase';
import { WeatherForecast } from './weatherService';

export type RiskLevel = 'low' | 'medium' | 'high' | 'severe';

export interface RiskAnalysis {
  riskVeryHot: RiskLevel;
  riskVeryCold: RiskLevel;
  riskVeryWindy: RiskLevel;
  riskVeryWet: RiskLevel;
  riskUncomfortable: RiskLevel;
  overallRiskScore: number;
  confidenceLevel: number;
  details: {
    temperature: { max: number; min: number; avg: number };
    feelsLike: { max: number; min: number };
    wind: { max: number };
    precipitation: { total: number };
    humidity: { avg: number };
  };
}

export class RiskCalculator {
  private static readonly DEFAULT_THRESHOLDS: RiskThresholds = {
    temp_very_hot: 35,
    temp_very_cold: 0,
    wind_speed_high: 15,
    precipitation_high: 20,
    humidity_uncomfortable: 80,
    feels_like_hot: 40,
    feels_like_cold: -5
  };

  static calculateRisk(
    forecast: WeatherForecast[],
    thresholds: RiskThresholds = this.DEFAULT_THRESHOLDS
  ): RiskAnalysis {
    if (forecast.length === 0) {
      return this.getEmptyRiskAnalysis();
    }

    const tempMax = Math.max(...forecast.map(f => f.tempMax));
    const tempMin = Math.min(...forecast.map(f => f.tempMin));
    const tempAvg = forecast.reduce((sum, f) => sum + f.tempAvg, 0) / forecast.length;

    const feelsLikeMax = Math.max(...forecast.map(f => f.feelsLikeMax));
    const feelsLikeMin = Math.min(...forecast.map(f => f.feelsLikeMin));

    const windMax = Math.max(...forecast.map(f => f.windSpeedMax));
    const precipTotal = forecast.reduce((sum, f) => sum + f.precipitationTotal, 0);
    const humidityAvg = forecast.reduce((sum, f) => sum + f.humidityAvg, 0) / forecast.length;

    const riskVeryHot = this.calculateTemperatureRisk(tempMax, thresholds.temp_very_hot, true);
    const riskVeryCold = this.calculateTemperatureRisk(tempMin, thresholds.temp_very_cold, false);
    const riskVeryWindy = this.calculateWindRisk(windMax, thresholds.wind_speed_high);
    const riskVeryWet = this.calculatePrecipitationRisk(precipTotal, thresholds.precipitation_high);
    const riskUncomfortable = this.calculateComfortRisk(
      feelsLikeMax,
      feelsLikeMin,
      humidityAvg,
      thresholds
    );

    const overallRiskScore = this.calculateOverallRisk([
      riskVeryHot,
      riskVeryCold,
      riskVeryWindy,
      riskVeryWet,
      riskUncomfortable
    ]);

    const confidenceLevel = this.calculateConfidence(forecast.length);

    return {
      riskVeryHot,
      riskVeryCold,
      riskVeryWindy,
      riskVeryWet,
      riskUncomfortable,
      overallRiskScore,
      confidenceLevel,
      details: {
        temperature: { max: tempMax, min: tempMin, avg: tempAvg },
        feelsLike: { max: feelsLikeMax, min: feelsLikeMin },
        wind: { max: windMax },
        precipitation: { total: precipTotal },
        humidity: { avg: humidityAvg }
      }
    };
  }

  private static calculateTemperatureRisk(
    temp: number,
    threshold: number,
    isHot: boolean
  ): RiskLevel {
    if (isHot) {
      const diff = temp - threshold;
      if (diff >= 10) return 'severe';
      if (diff >= 5) return 'high';
      if (diff >= 0) return 'medium';
      return 'low';
    } else {
      const diff = threshold - temp;
      if (diff >= 10) return 'severe';
      if (diff >= 5) return 'high';
      if (diff >= 0) return 'medium';
      return 'low';
    }
  }

  private static calculateWindRisk(windSpeed: number, threshold: number): RiskLevel {
    const diff = windSpeed - threshold;
    if (diff >= 15) return 'severe';
    if (diff >= 10) return 'high';
    if (diff >= 5) return 'medium';
    if (diff >= 0) return 'medium';
    return 'low';
  }

  private static calculatePrecipitationRisk(
    precipitation: number,
    threshold: number
  ): RiskLevel {
    const diff = precipitation - threshold;
    if (diff >= 50) return 'severe';
    if (diff >= 30) return 'high';
    if (diff >= 10) return 'medium';
    if (diff >= 0) return 'medium';
    return 'low';
  }

  private static calculateComfortRisk(
    feelsLikeMax: number,
    feelsLikeMin: number,
    humidity: number,
    thresholds: RiskThresholds
  ): RiskLevel {
    let score = 0;

    if (feelsLikeMax >= thresholds.feels_like_hot) {
      score += (feelsLikeMax - thresholds.feels_like_hot) / 10;
    }

    if (feelsLikeMin <= thresholds.feels_like_cold) {
      score += (thresholds.feels_like_cold - feelsLikeMin) / 10;
    }

    if (humidity >= thresholds.humidity_uncomfortable) {
      score += (humidity - thresholds.humidity_uncomfortable) / 20;
    }

    if (score >= 3) return 'severe';
    if (score >= 2) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }

  private static calculateOverallRisk(risks: RiskLevel[]): number {
    const riskValues: { [key in RiskLevel]: number } = {
      low: 0,
      medium: 25,
      high: 60,
      severe: 90
    };

    const total = risks.reduce((sum, risk) => sum + riskValues[risk], 0);
    return Math.min(100, Math.round(total / risks.length));
  }

  private static calculateConfidence(forecastDays: number): number {
    if (forecastDays <= 3) return 90;
    if (forecastDays <= 7) return 75;
    if (forecastDays <= 14) return 60;
    return 45;
  }

  private static getEmptyRiskAnalysis(): RiskAnalysis {
    return {
      riskVeryHot: 'low',
      riskVeryCold: 'low',
      riskVeryWindy: 'low',
      riskVeryWet: 'low',
      riskUncomfortable: 'low',
      overallRiskScore: 0,
      confidenceLevel: 0,
      details: {
        temperature: { max: 0, min: 0, avg: 0 },
        feelsLike: { max: 0, min: 0 },
        wind: { max: 0 },
        precipitation: { total: 0 },
        humidity: { avg: 0 }
      }
    };
  }

  static getRiskColor(risk: RiskLevel): string {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      severe: '#7f1d1d'
    };
    return colors[risk];
  }

  static getRiskLabel(risk: RiskLevel): string {
    const labels = {
      low: 'Low Risk',
      medium: 'Medium Risk',
      high: 'High Risk',
      severe: 'Severe Risk'
    };
    return labels[risk];
  }
}
