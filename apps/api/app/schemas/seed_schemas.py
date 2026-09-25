from pydantic import BaseModel, Field
from typing import List, Optional

class SeedItem(BaseModel):
    crop: str
    variety: str
    sathi_lot_number: str
    tag: str
    germination_pct: float
    purity_pct: float
    mrp_inr_kg: float
    dbt_subsidized_price_inr: float
    stock_kg: float

class SeedHubResponse(BaseModel):
    id: str
    name: str
    hub_type: str
    latitude: float
    longitude: float
    district: str
    taluk: str
    contact_phone: str
    distance_km: float
    inventory: List[SeedItem]

class SeedReservationRequest(BaseModel):
    hub_id: str
    crop: str
    variety: str
    quantity_kg: float
    farmer_id: Optional[str] = "KA-FRUITS-2024-9981"
    fruits_id: Optional[str] = "KA-FRUITS-2024-9981"

class SeedReservationResponse(BaseModel):
    reservation_id: str
    qr_token: str
    expiry_hours: int = 48
    pickup_hub_name: str
    crop: str
    variety: str
    quantity_kg: float
    total_payable_inr: float
    dbt_savings_inr: float
    status: str = "CONFIRMED_RESERVED"
