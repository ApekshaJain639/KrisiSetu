from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title="KRISISETU (ಕೃಷಿಸೇತು) Backend Engine",
    description="The Unified Agentic Intelligence & Market Ecosystem for Smallholders",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_db_init():
    """Ensure database schema and initial admin users exist on any fresh cloud deployment."""
    try:
        from app.core.database import engine, Base
        import app.models  # ensure models are registered
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            
        from app.models.admin_user import AdminUser
        from sqlalchemy.ext.asyncio import AsyncSession
        from sqlalchemy import select
        import hashlib

        def _hash(pw: str) -> str:
            salted = f"krishisetu_salt_{pw}_2026"
            return hashlib.sha256(salted.encode()).hexdigest()

        async with AsyncSession(engine) as session:
            admin_check = await session.execute(select(AdminUser).limit(1))
            if not admin_check.scalar_one_or_none():
                session.add(AdminUser(
                    username="admin",
                    password_hash=_hash("admin123"),
                    full_name="KrishiSetu Super Admin",
                    role="sdm_admin",
                    taluk="All",
                ))
                session.add(AdminUser(
                    username="dho_puttur",
                    password_hash=_hash("puttur@2026"),
                    full_name="District Horticulture Officer, Puttur",
                    role="district_officer",
                    taluk="Puttur",
                ))
                await session.commit()
    except Exception as e:
        print(f"[Startup Warning] Schema initialization: {e}")

@app.get("/")
def root():
    return {
        "project": "KRISISETU (ಕೃಷಿಸೇತು)",
        "status": "ONLINE",
        "version": settings.VERSION,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
