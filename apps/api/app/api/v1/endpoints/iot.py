from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()

class ValveActuationRequest(BaseModel):
    zone_id: str
    valve_state: bool # True = Open, False = Closed
    duration_minutes: int = 15

@router.get("/telemetry")
def get_iot_telemetry() -> Dict[str, Any]:
    return {
        "device_id": "ESP32-NODE-UJIREEAST-01",
        "soil_moisture_15cm_pct": 34.2,
        "soil_moisture_30cm_pct": 48.5,
        "canopy_infrared_temp_c": 28.1,
        "solar_lux": 42500,
        "lorawan_rssi_dbm": -88,
        "battery_volts": 3.92,
        "solenoid_valve_state": "CLOSED",
        "last_sync": "Just now (IN865 LoRaWAN)"
    }

@router.post("/valve-actuate")
def actuate_solenoid_valve(req: ValveActuationRequest) -> Dict[str, Any]:
    return {
        "status": "SUCCESS",
        "zone_id": req.zone_id,
        "action": "VALVE_OPENED" if req.valve_state else "VALVE_CLOSED",
        "duration_minutes": req.duration_minutes,
        "message": "MOSFET Relay pulse dispatched via LoRaWAN downlink."
    }
