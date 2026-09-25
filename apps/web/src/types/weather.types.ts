export interface DailyForecast {
  date: string;
  max_temp_c: number;
  min_temp_c: number;
  rain_probability_pct: number;
  rainfall_volume_mm: number;
  wind_speed_kmh: number;
  solar_radiation_mj: number;
  et0_evapotranspiration_mm: number;
}

export interface HazardGauge {
  name: string;
  score_pct: number;
  status: string;
  description: string;
}

export interface WeatherAdvisory {
  latitude: number;
  longitude: number;
  hazard_gauges: Record<string, HazardGauge>;
  koleroga_72h_warning: boolean;
  koleroga_risk_description: string;
  foliar_spraying_score_today: number;
  best_spraying_hours: string[];
  smart_irrigation_recommendation: string;
  daily_forecasts: DailyForecast[];
}
