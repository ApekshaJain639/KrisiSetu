from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from app.core.database import Base

class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    parcel_name = Column(String(100), default="Plot A - Main Garden")
    acreage = Column(Float, default=4.2)
    soil_type = Column(String(50), default="Laterite / red coastal")
    ph = Column(Float, default=5.8)
    nitrogen = Column(Float, default=110.0)
    phosphorus = Column(Float, default=45.0)
    potassium = Column(Float, default=135.0)
    primary_crop = Column(String(50), default="Arecanut + Pepper")
    avg_ndvi = Column(Float, default=0.76)
    aquifer_stress = Column(String(50), default="Safe (6.8m bgl)")
    geometry_geojson = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
