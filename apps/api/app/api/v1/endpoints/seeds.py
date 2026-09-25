from fastapi import APIRouter, Query, Depends
from typing import List, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.seed_hub import SeedReservation, SeedHub
from app.schemas.seed_schemas import (
    SeedHubResponse,
    SeedReservationRequest,
    SeedReservationResponse
)
from app.services.seed_service import seed_service

router = APIRouter()

@router.get("/nearby", response_model=List[SeedHubResponse])
def get_nearby_seed_hubs(
    lat: float = Query(13.0032, description="Farmer latitude"),
    lng: float = Query(75.2954, description="Farmer longitude"),
    radius_km: float = Query(50.0, description="Discovery radius in km"),
    crop: Optional[str] = Query(None, description="Optional crop filter")
):
    return seed_service.find_nearby_hubs(lat, lng, radius_km, crop)

@router.post("/reserve", response_model=SeedReservationResponse)
async def reserve_seed_stock(
    req: SeedReservationRequest,
    db: AsyncSession = Depends(get_db)
):
    res = seed_service.reserve_seeds(req)

    # Determine numeric hub_id and farmer_id for DB foreign keys
    hub_num = 1
    if req.hub_id:
        import re
        m = re.search(r'\d+', str(req.hub_id))
        if m:
            hub_num = int(m.group(0))

    farmer_num = 1
    if req.farmer_id and str(req.farmer_id).isdigit():
        farmer_num = int(req.farmer_id)

    # Persist reservation into SQLite database
    db_reservation = SeedReservation(
        farmer_id=farmer_num,
        seed_hub_id=hub_num,
        qr_token=res.qr_token,
        quantity_bags=max(1, int(req.quantity_kg)),
        total_amount=res.total_payable_inr,
        dbt_subsidy_amount=res.dbt_savings_inr,
        fruits_id=req.fruits_id or "KA-FRUITS-2024-9981",
        status="RESERVED_ACTIVE",
        expires_at=datetime.utcnow() + timedelta(hours=48)
    )
    db.add(db_reservation)
    await db.commit()
    await db.refresh(db_reservation)

    return res
