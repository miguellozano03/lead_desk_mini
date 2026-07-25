import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_admin
from app.models.lead import LeadStatus
from app.schemas.lead import LeadCreate, LeadListOut, LeadOut, LeadStatusUpdate
from app.services.lead_service import LeadService

public_router = APIRouter(prefix="/leads", tags=["leads-public"])
admin_router = APIRouter(
    prefix="/admin/leads",
    tags=["leads-admin"],
    dependencies=[Depends(require_admin)],
)


@public_router.post("", response_model=LeadOut, status_code=201)
def create_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    return LeadService(db).create_lead(payload)


@admin_router.get("", response_model=LeadListOut)
def list_leads(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None, max_length=120),
    status: LeadStatus | None = Query(None),
    db: Session = Depends(get_db),
):
    return LeadService(db).list_leads(page, page_size, search, status)


@admin_router.patch("/{lead_id}/status", response_model=LeadOut)
def update_lead_status(
    lead_id: uuid.UUID,
    payload: LeadStatusUpdate,
    db: Session = Depends(get_db),
):
    return LeadService(db).update_status(lead_id, payload.status)
