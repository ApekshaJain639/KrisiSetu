from pydantic import BaseModel, Field
from typing import List, Optional

class ArbitrageRequest(BaseModel):
    commodity: str = Field(default="Arecanut")
    quantity_quintals: float = Field(default=25.0, ge=1.0)
    origin_latitude: float = Field(default=13.0032) # Ujire / Belthangady
    origin_longitude: float = Field(default=75.2954)
    vehicle_type: str = Field(default="Pickup 1.5T", description="Tractor, Pickup 1.5T, Truck 4T")

class MandiOption(BaseModel):
    mandi_name: str
    district: str
    modal_price_per_qtl: float
    distance_km: float
    freight_cost_inr: float
    mandi_tax_inr: float
    gross_revenue_inr: float
    net_in_hand_inr: float
    net_bonus_vs_local_inr: float

class ArbitrageResponse(BaseModel):
    commodity: str
    quantity_quintals: float
    recommended_mandi: str
    net_bonus_profit: float
    mandis_ranked: List[MandiOption]

class PriceForecastPoint(BaseModel):
    days_ahead: int
    projected_price: float
    lower_bound_95: float
    upper_bound_95: float

class PriceForecastResponse(BaseModel):
    commodity: str
    current_modal_price: float
    forecast_points: List[PriceForecastPoint]
    hold_vs_sell_recommendation: str
    expected_gain_if_held_inr: float

class PooledFarmer(BaseModel):
    id: str
    name: str
    quantity_quintals: float
    distance_km: float

class BatchPoolingCluster(BaseModel):
    cluster_id: str
    total_quantity_tonnes: float
    target_lot_tonnes: float
    logistics_savings_pct: float
    pooled_farmers: List[PooledFarmer]
    status: str
