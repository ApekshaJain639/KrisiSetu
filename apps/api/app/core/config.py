import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "KRISISETU API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database & Redis
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://krisisetu_admin:secret_password@localhost:5432/krisisetu_db"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI & Multimodal Keys
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    
    # Meta WhatsApp Cloud API (Accountability Engine)
    META_WHATSAPP_TOKEN: Optional[str] = os.getenv("META_WHATSAPP_TOKEN", "")
    META_PHONE_NUMBER_ID: Optional[str] = os.getenv("META_PHONE_NUMBER_ID", "")
    WHATSAPP_VERIFY_TOKEN: str = os.getenv("WHATSAPP_VERIFY_TOKEN", "krisisetu_webhook_secret")
    
    # Open-Meteo & OSRM Endpoints
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1/forecast"
    OPEN_METEO_GEOCODING_URL: str = "https://geocoding-api.open-meteo.com/v1/search"
    OSRM_ROUTING_URL: str = "http://router.project-osrm.org/route/v1/driving"

    # Sarvam AI API Keys (Indian Voice Models)
    SARVAM_API_KEY: Optional[str] = os.getenv("SARVAM_API_KEY", os.getenv("NEXT_PUBLIC_SARVAM_API_KEY", ""))

    # data.gov.in / eNAM Open Government Data API Key
    DATAGOV_API_KEY: Optional[str] = os.getenv("DATAGOV_API_KEY", "")

    # Data directory path
    DATA_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
