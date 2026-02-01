from __future__ import annotations
from sqlalchemy.orm import Session

from app.models import Column, Board


class ColumnRepository:
    def create(self, db: Session, board_id: str, name: str) -> Column | None:
        board = db.query(Board).filter(Board.id == board_id).first()
        if not board:
            return None

        max_position = db.query(Column).filter(Column.board_id == board_id).count()
        column = Column(board_id=board_id, name=name, position=max_position)
        db.add(column)
        db.commit()
        db.refresh(column)
        return column

    def get_by_id(self, db: Session, column_id: str) -> Column | None:
        return db.query(Column).filter(Column.id == column_id).first()
