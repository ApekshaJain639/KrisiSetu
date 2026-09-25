"""
Auth endpoints — Farmer Register/Login + Admin Login
Password hashing: SHA-256 with project salt (zero external dependencies).
"""
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.farmer import Farmer
from app.models.admin_user import AdminUser

router = APIRouter()

# In-memory active session tokens (simple, fast, zero Redis setup)
_active_tokens: dict[str, dict] = {}


def _hash_password(password: str) -> str:
    salted = f"krishisetu_salt_{password}_2026"
    return hashlib.sha256(salted.encode()).hexdigest()


def _make_token(user_id: int, role: str) -> str:
    token = secrets.token_urlsafe(32)
    _active_tokens[token] = {
        "user_id": user_id,
        "role": role,
        "expires": datetime.utcnow() + timedelta(days=7),
    }
    return token


# ── Schemas ──────────────────────────────────────────────────────────────────

class FarmerRegisterRequest(BaseModel):
    name: str
    phone: str
    password: str
    fruits_id: Optional[str] = None
    language: str = "kn"
    taluk: str = "Puttur"
    village: str = "Bettampady"
    total_acreage: float = 4.2
    crop_type: str = "Arecanut, Pepper"


class FarmerLoginRequest(BaseModel):
    phone: str
    password: str


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    success: bool
    token: str
    role: str  # "farmer" | "sdm_admin" | "district_officer" | "taluk_officer"
    user_id: int
    name: str
    message: str
    # Farmer profile fields
    language: Optional[str] = None
    taluk: Optional[str] = None
    village: Optional[str] = None
    total_acreage: Optional[float] = None
    crop_type: Optional[str] = None
    fruits_id: Optional[str] = None


# ── 1. Farmer Register (Create Account) ────────────────────────────────────────

@router.post("/farmer/register", response_model=AuthResponse)
async def farmer_register(
    payload: FarmerRegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    # Normalize phone: remove spaces and hyphens
    clean_phone = payload.phone.replace(" ", "").replace("-", "")

    # Check if phone already registered
    existing = await db.execute(select(Farmer).where(Farmer.phone == clean_phone))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This mobile number is already registered. Please sign in instead.",
        )

    # Auto-generate Karnataka FRUITS ID if not provided: KA-DK-PUT-{random}
    fruits_id = payload.fruits_id or f"KA-DK-{clean_phone[-4:]}-{secrets.token_hex(2).upper()}"

    farmer = Farmer(
        name=payload.name.strip(),
        phone=clean_phone,
        password_hash=_hash_password(payload.password),
        fruits_id=fruits_id,
        language=payload.language,
        taluk=payload.taluk,
        village=payload.village,
        total_acreage=payload.total_acreage,
        crop_type=payload.crop_type,
        created_at=datetime.utcnow(),
    )
    db.add(farmer)
    await db.commit()
    await db.refresh(farmer)

    token = _make_token(farmer.id, "farmer")
    return AuthResponse(
        success=True,
        token=token,
        role="farmer",
        user_id=farmer.id,
        name=farmer.name,
        message=f"Account created successfully! Welcome to KrishiSetu, {farmer.name}.",
        language=farmer.language,
        taluk=farmer.taluk,
        village=farmer.village,
        total_acreage=farmer.total_acreage,
        crop_type=farmer.crop_type,
        fruits_id=farmer.fruits_id,
    )


# ── 2. Farmer Login ───────────────────────────────────────────────────────────

@router.post("/farmer/login", response_model=AuthResponse)
async def farmer_login(
    payload: FarmerLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    clean_phone = payload.phone.replace(" ", "").replace("-", "")

    result = await db.execute(select(Farmer).where(Farmer.phone == clean_phone))
    farmer = result.scalar_one_or_none()

    # If farmer exists with demo password bypass OR matching hash
    is_demo = farmer and getattr(farmer, "password_hash", "demo") == "demo"
    pwd_ok = is_demo or (farmer and farmer.password_hash == _hash_password(payload.password))

    if not farmer or not pwd_ok:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect mobile number or password.",
        )

    if not getattr(farmer, "is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account suspended. Please contact your taluk horticulture office.",
        )

    token = _make_token(farmer.id, "farmer")
    return AuthResponse(
        success=True,
        token=token,
        role="farmer",
        user_id=farmer.id,
        name=farmer.name,
        message=f"Welcome back, {farmer.name}!",
        language=farmer.language or "kn",
        taluk=farmer.taluk or "Puttur",
        village=farmer.village or "Bettampady",
        total_acreage=farmer.total_acreage or 4.2,
        crop_type=getattr(farmer, "crop_type", "Arecanut, Pepper"),
        fruits_id=farmer.fruits_id,
    )


# ── 3. Admin Login ────────────────────────────────────────────────────────────

@router.post("/admin/login", response_model=AuthResponse)
async def admin_login(
    payload: AdminLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AdminUser).where(AdminUser.username == payload.username.strip().lower())
    )
    admin = result.scalar_one_or_none()

    if not admin or admin.password_hash != _hash_password(payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin username or password.",
        )

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive.",
        )

    admin.last_login = datetime.utcnow()
    await db.commit()

    token = _make_token(admin.id, admin.role)
    return AuthResponse(
        success=True,
        token=token,
        role=admin.role,
        user_id=admin.id,
        name=admin.full_name,
        message=f"Admin console authenticated. Welcome, {admin.full_name}.",
        taluk=admin.taluk,
    )


# ── 4. Verify Token ───────────────────────────────────────────────────────────

class TokenVerifyRequest(BaseModel):
    token: str


@router.post("/verify")
async def verify_token(payload: TokenVerifyRequest):
    info = _active_tokens.get(payload.token)
    if not info:
        raise HTTPException(status_code=401, detail="Session expired or invalid.")
    if datetime.utcnow() > info["expires"]:
        del _active_tokens[payload.token]
        raise HTTPException(status_code=401, detail="Session expired. Please sign in again.")
    return {"valid": True, "user_id": info["user_id"], "role": info["role"]}


# ── 5. Logout ─────────────────────────────────────────────────────────────────

@router.post("/logout")
async def logout(payload: TokenVerifyRequest):
    _active_tokens.pop(payload.token, None)
    return {"success": True, "message": "Signed out successfully."}
