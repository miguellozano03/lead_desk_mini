import os
import sys

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.admin_user import AdminUser


def seed_admin(email: str, password: str):
    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter(AdminUser.email == email).first()
        if existing:
            print(f"Admin '{email}' already exists, skipping creation.")
            return

        admin = AdminUser(email=email.lower().strip(), hashed_password=hash_password(password))
        db.add(admin)
        db.commit()
        print(f"Admin '{email}' created successfully.")
    finally:
        db.close()


def seed_from_env():
    email = os.getenv("SEED_ADMIN_EMAIL")
    password = os.getenv("SEED_ADMIN_PASSWORD")

    if not email or not password:
        print("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set, skipping seed.")
        return

    seed_admin(email, password)


if __name__ == "__main__":
    if len(sys.argv) == 3:
        seed_admin(sys.argv[1], sys.argv[2])
    else:
        seed_from_env()
