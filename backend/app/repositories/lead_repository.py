import uuid

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.lead import Lead, LeadStatus


class LeadRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, lead: Lead) -> Lead:
        self.db.add(lead)
        self.db.commit()
        self.db.refresh(lead)
        return lead

    def get_by_id(self, lead_id: uuid.UUID) -> Lead | None:
        return self.db.get(Lead, lead_id)

    def list(
        self,
        page: int,
        page_size: int,
        search: str | None = None,
        status: LeadStatus | None = None,
    ) -> tuple[list[Lead], int]:
        query = self.db.query(Lead)

        if status is not None:
            query = query.filter(Lead.status == status)

        if search:
            like = f"%{search}%"
            query = query.filter(
                or_(
                    Lead.name.ilike(like),
                    Lead.email.ilike(like),
                    Lead.message.ilike(like),
                )
            )

        total = query.with_entities(func.count(Lead.id)).scalar()

        items = (
            query.order_by(Lead.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return items, total

    def update_status(self, lead: Lead, status: LeadStatus) -> Lead:
        lead.status = status
        self.db.commit()
        self.db.refresh(lead)
        return lead
