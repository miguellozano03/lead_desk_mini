import uuid

from fastapi import HTTPException
from fastapi import status as http_status
from sqlalchemy.orm import Session

from app.models.lead import Lead, LeadStatus
from app.repositories.lead_repository import LeadRepository
from app.schemas.lead import LeadCreate, LeadListOut, LeadOut


class LeadService:
    def __init__(self, db: Session):
        self.repo = LeadRepository(db)

    def create_lead(self, data: LeadCreate) -> Lead:
        lead = Lead(
            name=data.name.strip(),
            email=data.email.lower().strip(),
            budget_range=data.budget_range.strip(),
            message=(data.message or "").strip() or None,
        )
        return self.repo.create(lead)

    def list_leads(
        self,
        page: int = 1,
        page_size: int = 20,
        search: str | None = None,
        status_filter: LeadStatus | None = None,
    ) -> LeadListOut:
        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)

        items, total = self.repo.list(page, page_size, search, status_filter)
        pages = (total + page_size - 1) // page_size if total else 0

        return LeadListOut(
            items=[LeadOut.model_validate(i) for i in items],
            total=total,
            page=page,
            page_size=page_size,
            pages=pages,
        )

    def update_status(self, lead_id: uuid.UUID, new_status: LeadStatus) -> Lead:
        lead = self.repo.get_by_id(lead_id)
        if lead is None:
            raise HTTPException(
                status_code=http_status.HTTP_404_NOT_FOUND,
                detail="Lead not found",
            )
        return self.repo.update_status(lead, new_status)
