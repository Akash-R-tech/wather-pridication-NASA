import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface RiskThresholds {
  id?: string;
  user_id?: string;
  temp_very_hot: number;
  temp_very_cold: number;
  wind_speed_high: number;
  precipitation_high: number;
  humidity_uncomfortable: number;
  feels_like_hot: number;
  feels_like_cold: number;
}

export interface SavedLocation {
  id?: string;
  user_id?: string;
  name: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  created_at?: string;
}

export interface EventPlan {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  location_id?: string;
  start_date: string;
  end_date: string;
  activity_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  forecast_date: string;
  temp_max: number;
  temp_min: number;
  temp_avg: number;
  feels_like_max: number;
  feels_like_min: number;
  wind_speed_max: number;
  precipitation_total: number;
  humidity_avg: number;
  weather_description: string;
}

export interface RiskAssessment {
  id?: string;
  event_id: string;
  assessment_date: string;
  risk_very_hot: 'low' | 'medium' | 'high' | 'severe';
  risk_very_cold: 'low' | 'medium' | 'high' | 'severe';
  risk_very_windy: 'low' | 'medium' | 'high' | 'severe';
  risk_very_wet: 'low' | 'medium' | 'high' | 'severe';
  risk_uncomfortable: 'low' | 'medium' | 'high' | 'severe';
  overall_risk_score: number;
  confidence_level: number;
}
