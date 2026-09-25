import sqlite3
import os

db_path = r"C:\Users\mr\.gemini\antigravity\scratch\krisisetu\apps\krisisetu.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(farmers)")
cols = [c[1] for c in cursor.fetchall()]

if "password_hash" not in cols:
    cursor.execute("ALTER TABLE farmers ADD COLUMN password_hash VARCHAR(255) DEFAULT 'demo'")
    print("Added password_hash column")
if "crop_type" not in cols:
    cursor.execute("ALTER TABLE farmers ADD COLUMN crop_type VARCHAR(100) DEFAULT 'Arecanut, Pepper'")
    print("Added crop_type column")
if "is_active" not in cols:
    cursor.execute("ALTER TABLE farmers ADD COLUMN is_active BOOLEAN DEFAULT 1")
    print("Added is_active column")

conn.commit()

cursor.execute("PRAGMA table_info(farmers)")
print("Updated farmers columns:", [c[1] for c in cursor.fetchall()])
cursor.execute("SELECT id, name, phone, password_hash, crop_type FROM farmers")
for row in cursor.fetchall():
    print("  Farmer:", row)
conn.close()
