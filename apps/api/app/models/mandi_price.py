from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.core.database import Base

class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    commodity = Column(String(50), nullable=False, index=True)
    variety = Column(String(50), default="Chali / A-Sample")
    market_name = Column(String(100), nullable=False, index=True)
    district = Column(String(50), nullable=False)
    modal_price = Column(Float, nullable=False)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    arrival_volume_qtl = Column(Float, default=150.0)
    price_date = Column(DateTime, default=datetime.utcnow)
