from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from app.core.database import Base

class IoTTelemetry(Base):
    __tablename__ = "iot_telemetry"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String(50), default="NODE-PUTTUR-ESP32-01", index=True)
    soil_moisture_15cm = Column(Float, default=58.0)
    soil_moisture_30cm = Column(Float, default=64.0)
    canopy_temp = Column(Float, default=26.8)
    solar_lux = Column(Float, default=48200.0)
    battery_level = Column(Float, default=94.0)
    rssi_dbm = Column(Float, default=-84.0)
    valve_actuated = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AdminAlert(Base):
    __tablename__ = "admin_alerts"

    id = Column(Integer, primary_key=True, index=True)
    taluk = Column(String(50), nullable=False, index=True)
    hazard_type = Column(String(50), default="FUNGAL_BLIGHT_KOLEROGA")
    risk_percentage = Column(Float, default=78.0)
    severity_level = Column(String(20), default="CRITICAL")  # CRITICAL, WARNING, ADVISORY
    crop_affected = Column(String(50), default="Arecanut")
    broadcast_channel = Column(String(30), default="WHATSAPP_SMS_VOICE")
    farmers_notified_count = Column(Integer, default=320)
    containment_status = Column(String(30), default="ACTIVE_SURVEILLANCE")
    created_at = Column(DateTime, default=datetime.utcnow)
