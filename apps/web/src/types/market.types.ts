export interface MandiOption {
  mandi_name: string;
  district: string;
  modal_price_per_qtl: number;
  distance_km: number;
  freight_cost_inr: number;
  mandi_tax_inr: number;
  gross_revenue_inr: number;
  net_in_hand_inr: number;
  net_bonus_vs_local_inr: number;
}

export interface ArbitrageResult {
  commodity: string;
  quantity_quintals: number;
  recommended_mandi: string;
  net_bonus_profit: number;
  mandis_ranked: MandiOption[];
}

export interface PriceForecastPoint {
  days_ahead: number;
  projected_price: number;
  lower_bound_95: number;
  upper_bound_95: number;
}

export interface PriceForecast {
  commodity: string;
  current_modal_price: number;
  forecast_points: PriceForecastPoint[];
  hold_vs_sell_recommendation: string;
  expected_gain_if_held_inr: number;
}

export interface PooledFarmer {
  id: string;
  name: string;
  quantity_quintals: number;
  distance_km: number;
}

export interface BatchPoolingCluster {
  cluster_id: string;
  total_quantity_tonnes: number;
  target_lot_tonnes: number;
  logistics_savings_pct: number;
  pooled_farmers: PooledFarmer[];
  status: string;
}
