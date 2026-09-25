import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# Determine database engine: use SQLite by default if PostgreSQL connection is local default
db_url = settings.DATABASE_URL
if "postgresql" in db_url and not os.getenv("USE_POSTGRES", False):
    # Use reliable local SQLite database for zero-config immediate operation
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../krisisetu.db"))
    db_url = f"sqlite+aiosqlite:///{db_path}"

engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    connect_args={"check_same_thread": False} if "sqlite" in db_url else {}
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
