import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

async def main():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Test farmer login with demo
        r1 = await client.post("/api/v1/auth/farmer/login", json={"phone": "9876543210", "password": "any"})
        print("1. Farmer Login (demo):", r1.status_code, r1.json())

        # 2. Test farmer registration (create account)
        r2 = await client.post("/api/v1/auth/farmer/register", json={
            "name": "Mahabala Bhat",
            "phone": "9845112233",
            "password": "secret_password",
            "taluk": "Sullia",
            "village": "Guthigar",
            "total_acreage": 5.5,
            "crop_type": "Rubber, Arecanut"
        })
        print("2. Farmer Register:", r2.status_code, r2.json())

        # 3. Test login with newly created farmer account
        r3 = await client.post("/api/v1/auth/farmer/login", json={"phone": "9845112233", "password": "secret_password"})
        print("3. Login with New Account:", r3.status_code, r3.json())

        # 4. Test wrong password
        r4 = await client.post("/api/v1/auth/farmer/login", json={"phone": "9845112233", "password": "wrongpassword"})
        print("4. Wrong Password (expect 401):", r4.status_code, r4.json())

        # 5. Test admin login
        r5 = await client.post("/api/v1/auth/admin/login", json={"username": "admin", "password": "admin123"})
        print("5. Admin Login (admin):", r5.status_code, r5.json())

        # 6. Test district officer admin login
        r6 = await client.post("/api/v1/auth/admin/login", json={"username": "dho_puttur", "password": "puttur@2026"})
        print("6. Admin Login (dho_puttur):", r6.status_code, r6.json())

        # 7. Test wrong admin password
        r7 = await client.post("/api/v1/auth/admin/login", json={"username": "admin", "password": "wrong"})
        print("7. Wrong Admin Password (expect 401):", r7.status_code, r7.json())

if __name__ == "__main__":
    asyncio.run(main())
