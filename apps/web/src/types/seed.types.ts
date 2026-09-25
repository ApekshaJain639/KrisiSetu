export interface SeedItem {
  crop: string;
  variety: string;
  sathi_lot_number: string;
  tag: string;
  germination_pct: number;
  purity_pct: number;
  mrp_inr_kg: number;
  dbt_subsidized_price_inr: number;
  stock_kg: number;
}

export interface SeedHub {
  id: string;
  name: string;
  hub_type: string;
  latitude: number;
  longitude: number;
  district: string;
  taluk: string;
  contact_phone: string;
  distance_km: number;
  inventory: SeedItem[];
}

export interface SeedReservation {
  reservation_id: string;
  qr_token: string;
  expiry_hours: number;
  pickup_hub_name: string;
  crop: string;
  variety: string;
  quantity_kg: number;
  total_payable_inr: number;
  dbt_savings_inr: number;
  status: string;
}
