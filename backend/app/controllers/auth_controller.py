from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_admin
from app.models.admin_user import AdminUser
from app.schemas.auth import AdminUserOut, LoginRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return AuthService(db).login(payload)


@router.get("/me", response_model=AdminUserOut)
def me(current_user: AdminUser = Depends(require_admin)):
    return current_user
