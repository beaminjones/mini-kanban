from __future__ import annotations
from sqlalchemy.orm import Session

from app.repositories.column_repository import ColumnRepository
from app.schemas.column import ColumnCreate, ColumnResponse


class ColumnService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ColumnRepository()

    def create_column(self, board_id: str, data: ColumnCreate) -> ColumnResponse | None:
        column = self.repository.create(self.db, board_id, data.name)
        if not column:
            return None
        return ColumnResponse.model_validate(column)
