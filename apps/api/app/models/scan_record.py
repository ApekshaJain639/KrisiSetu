from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from app.core.database import Base

class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=True)
    disease_name = Column(String(100), nullable=False)
    pathogen = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    dsi_score = Column(Float, nullable=False)
    taluk = Column(String(50), default="Puttur")
    image_url = Column(Text, nullable=True)
    heatmap_overlay_url = Column(Text, nullable=True)
    treatment_recommended = Column(Text, nullable=True)
    follow_up_day = Column(Integer, default=0)
    recovery_status = Column(String(30), default="IMPROVING")
    created_at = Column(DateTime, default=datetime.utcnow)
