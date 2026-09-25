import asyncio
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
from datetime import datetime, timedelta
from app.core.database import engine, Base, AsyncSessionLocal
from app.models import (
    Farmer,
    Parcel,
    MandiPrice,
    ScanRecord,
    SeedHub,
    SeedReservation,
    IoTTelemetry,
    AdminAlert,
)

async def seed():
    print("🌾 Initializing KRISISETU database schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        from sqlalchemy import select
        res = await session.execute(select(Farmer))
        if res.scalars().first():
            print("✓ Database already seeded with records.")
            return

        print("🌱 Seeding Farmer Profiles...")
        f1 = Farmer(
            name="Shivappa Gowda",
            phone="9876543210",
            fruits_id="KA-FRUITS-2024-9981",
            language="kn",
            taluk="Puttur",
            village="Bettampady",
            total_acreage=4.2
        )
        f2 = Farmer(
            name="Ananda Rai",
            phone="9876543211",
            fruits_id="KA-FRUITS-2024-5542",
            language="kn",
            taluk="Belthangady",
            village="Ujire",
            total_acreage=3.5
        )
        f3 = Farmer(
            name="Shankara Bhat",
            phone="9876543212",
            fruits_id="KA-FRUITS-2024-1189",
            language="kn",
            taluk="Sullia",
            village="Guthigar",
            total_acreage=5.0
        )
        f4 = Farmer(
            name="Radhakrishna Hegde",
            phone="9876543213",
            fruits_id="KA-FRUITS-2024-7733",
            language="kn",
            taluk="Bantwal",
            village="Vitla",
            total_acreage=2.8
        )
        session.add_all([f1, f2, f3, f4])
        await session.flush()

        print("🗺️ Seeding Land Parcels...")
        p1 = Parcel(
            farmer_id=f1.id,
            parcel_name="Shrinivasa Farm · Plot A",
            acreage=4.2,
            soil_type="Laterite / red coastal",
            ph=5.8,
            nitrogen=110.0,
            phosphorus=45.0,
            potassium=135.0,
            primary_crop="Arecanut · Mangala + Black Pepper",
            avg_ndvi=0.76,
            aquifer_stress="Safe (6.8m bgl)"
        )
        session.add(p1)

        print("📈 Seeding APMC Mandi Daily Prices...")
        mandis = [
            ("Arecanut · Chali", "A-sample", "Puttur APMC", "Dakshina Kannada", 35800, 34000, 36200, 240.0),
            ("Arecanut · Red", "R-sample", "Puttur APMC", "Dakshina Kannada", 38200, 36500, 38900, 180.0),
            ("Black pepper", "Malabar Grade 1", "Puttur APMC", "Dakshina Kannada", 61400, 60000, 62500, 45.0),
            ("Tender coconut", "Grade A Large", "Puttur APMC", "Dakshina Kannada", 34, 30, 36, 12000.0),
            ("Arecanut · Chali", "A-sample", "Shivamogga APMC", "Shivamogga", 40000, 38500, 40800, 520.0),
            ("Arecanut · Chali", "A-sample", "Sirsi APMC", "Uttara Kannada", 38800, 37500, 39400, 310.0),
            ("Arecanut · Chali", "A-sample", "Mangaluru APMC", "Dakshina Kannada", 36200, 35000, 36800, 190.0),
        ]
        for m in mandis:
            session.add(MandiPrice(
                commodity=m[0], variety=m[1], market_name=m[2], district=m[3],
                modal_price=m[4], min_price=m[5], max_price=m[6], arrival_volume_qtl=m[7]
            ))

        print("🌱 Seeding SATHI Seed Hubs & Certified Cultivars...")
        h1 = SeedHub(
            hub_name="Raitha Samparka Kendra (RSK) Belthangady",
            hub_type="RSK", taluk="Belthangady", distance_km=8.5,
            crop="Arecanut", variety="Mangala Certified Seedlings",
            tag_color="Blue", germination_rate=94.0, genetic_purity=99.4,
            sathi_lot_number="SATHI-KA-2024-8819",
            open_market_price=180.0, subsidized_price=90.0, stock_bags=450
        )
        h2 = SeedHub(
            hub_name="Krishi Vigyan Kendra (KVK) Mangaluru",
            hub_type="KVK", taluk="Mangaluru", distance_km=22.0,
            crop="Paddy", variety="MO-4 (Bhadra) Foundation Seed",
            tag_color="White", germination_rate=96.0, genetic_purity=99.8,
            sathi_lot_number="SATHI-KA-2024-4412",
            open_market_price=950.0, subsidized_price=475.0, stock_bags=120
        )
        session.add_all([h1, h2])

        print("🔬 Seeding Crop Pathology Diagnostic Records...")
        scan1 = ScanRecord(
            farmer_id=f1.id,
            disease_name="Arecanut Koleroga (Fruit Rot)",
            pathogen="Phytophthora meadii",
            confidence=97.4,
            dsi_score=38.0,
            taluk="Puttur",
            recovery_status="IMPROVING",
            treatment_recommended="Bordeaux mixture 1% + Traditional Kotte Kattuva bunch-tying"
        )
        session.add(scan1)

        print("📡 Seeding AIoT Live Sensor Telemetry...")
        session.add(IoTTelemetry(
            node_id="NODE-PUTTUR-ESP32-01",
            soil_moisture_15cm=58.2,
            soil_moisture_30cm=64.0,
            canopy_temp=26.8,
            solar_lux=48200.0,
            battery_level=94.5,
            rssi_dbm=-84.0,
            valve_actuated=False
        ))

        print("🚨 Seeding Admin Disease Outbreak Alerts...")
        session.add(AdminAlert(
            taluk="Puttur",
            hazard_type="FUNGAL_BLIGHT_KOLEROGA",
            risk_percentage=78.0,
            severity_level="CRITICAL",
            crop_affected="Arecanut",
            farmers_notified_count=420,
            containment_status="ACTIVE_SURVEILLANCE"
        ))
        session.add(AdminAlert(
            taluk="Sullia",
            hazard_type="FUNGAL_BLIGHT_KOLEROGA",
            risk_percentage=82.0,
            severity_level="CRITICAL",
            crop_affected="Arecanut",
            farmers_notified_count=310,
            containment_status="ACTIVE_SURVEILLANCE"
        ))

        await session.commit()
        print("✅ Database successfully seeded with full production benchmark dataset!")

if __name__ == "__main__":
    asyncio.run(seed())
