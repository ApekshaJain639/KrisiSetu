from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from app.core.database import Base

class SeedHub(Base):
    __tablename__ = "seed_hubs"

    id = Column(Integer, primary_key=True, index=True)
    hub_name = Column(String(120), nullable=False)
    hub_type = Column(String(50), default="RSK")  # RSK, KVK, NSC, Heritage
    taluk = Column(String(50), default="Belthangady")
    distance_km = Column(Float, default=8.5)
    crop = Column(String(50), nullable=False)
    variety = Column(String(80), nullable=False)
    tag_color = Column(String(20), default="Blue")
    germination_rate = Column(Float, default=94.0)
    genetic_purity = Column(Float, default=99.2)
    sathi_lot_number = Column(String(50), unique=True, index=True)
    open_market_price = Column(Float, nullable=False)
    subsidized_price = Column(Float, nullable=False)
    stock_bags = Column(Integer, default=500)
    created_at = Column(DateTime, default=datetime.utcnow)

class SeedReservation(Base):
    __tablename__ = "seed_reservations"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    seed_hub_id = Column(Integer, ForeignKey("seed_hubs.id"), nullable=False)
    qr_token = Column(String(100), unique=True, index=True, nullable=False)
    quantity_bags = Column(Integer, default=5)
    total_amount = Column(Float, nullable=False)
    dbt_subsidy_amount = Column(Float, nullable=False)
    fruits_id = Column(String(50), nullable=False)
    status = Column(String(30), default="RESERVED_ACTIVE")  # RESERVED_ACTIVE, PICKED_UP, EXPIRED
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
