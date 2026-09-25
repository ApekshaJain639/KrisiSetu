export interface FertilizerSplit {
  basal_bags: number;
  vegetative_30das_bags: number;
  flowering_60das_bags: number;
}

export interface FertilizerSchedule {
  urea_50kg_bags: number;
  dap_50kg_bags: number;
  mop_50kg_bags: number;
  splits: {
    Urea: FertilizerSplit;
    DAP: FertilizerSplit;
    MOP: FertilizerSplit;
  };
}

export interface CropMatchRadar {
  soil_affinity: number;
  climate_match: number;
  npk_affinity: number;
  water_security: number;
}

export interface EconomicsProjection {
  expected_yield_quintals: number;
  gross_revenue_inr: number;
  cultivation_cost_inr: number;
  net_profit_inr: number;
  roi_percentage: number;
}

export interface RecommendedCrop {
  id: string;
  crop_name: string;
  scientific_name: string;
  suitability_score: number;
  match_radar: CropMatchRadar;
  economics: EconomicsProjection;
  sowing_season: string;
  optimal_window: string;
  recommended_varieties: string[];
  companion_crops: string[];
  fertilizer_schedule: FertilizerSchedule;
}
