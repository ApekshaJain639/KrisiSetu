import sys
import asyncio
import hashlib
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

from app.core.database import engine, Base
from app.models.admin_user import AdminUser
from app.models.farmer import Farmer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

async def seed_admins():
    # Create tables (will add admin_users and update farmers table)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    def _hash(pw: str) -> str:
        salted = f"krishisetu_salt_{pw}_2026"
        return hashlib.sha256(salted.encode()).hexdigest()

    admins = [
        {
            "username": "admin",
            "password_hash": _hash("admin123"),
            "full_name": "KrishiSetu Super Admin",
            "role": "sdm_admin",
            "taluk": "All",
        },
        {
            "username": "dho_puttur",
            "password_hash": _hash("puttur@2026"),
            "full_name": "District Horticulture Officer, Puttur",
            "role": "district_officer",
            "taluk": "Puttur",
        },
        {
            "username": "taluk_belthangady",
            "password_hash": _hash("belth@2026"),
            "full_name": "Taluk Agriculture Officer, Belthangady",
            "role": "taluk_officer",
            "taluk": "Belthangady",
        },
    ]

    async with AsyncSession(engine) as session:
        for a in admins:
            existing = await session.execute(
                select(AdminUser).where(AdminUser.username == a["username"])
            )
            if existing.scalar_one_or_none():
                print(f"  [skip] {a['username']} already exists")
                continue
            session.add(AdminUser(**a))
            print(f"  [+] Created admin user: {a['username']} ({a['role']})")
        await session.commit()

    print("\n✅ Admin credentials seeded successfully:")
    print("  1. Username: admin             Password: admin123     (SDM Admin)")
    print("  2. Username: dho_puttur        Password: puttur@2026  (District Officer)")
    print("  3. Username: taluk_belthangady Password: belth@2026   (Taluk Officer)")

if __name__ == "__main__":
    asyncio.run(seed_admins())
