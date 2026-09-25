from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from app.core.database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False, default="demo")
    fruits_id = Column(String(50), unique=True, index=True, nullable=False)
    language = Column(String(10), default="kn")
    taluk = Column(String(50), default="Puttur")
    village = Column(String(50), default="Bettampady")
    total_acreage = Column(Float, default=4.2)
    crop_type = Column(String(100), default="Arecanut, Pepper")
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
