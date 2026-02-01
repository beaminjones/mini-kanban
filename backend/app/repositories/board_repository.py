from __future__ import annotations
from sqlalchemy.orm import Session, joinedload

from app.models import Board, Column, Card


class BoardRepository:
    def create(self, db: Session, name: str) -> Board:
        board = Board(name=name)
        db.add(board)
        db.commit()
        db.refresh(board)
        return board

    def get_all(self, db: Session) -> list[Board]:
        return db.query(Board).all()

    def get_by_id(self, db: Session, board_id: str) -> Board | None:
        return db.query(Board).filter(Board.id == board_id).first()

    def get_by_id_with_columns_and_cards(self, db: Session, board_id: str) -> Board | None:
        return (
            db.query(Board)
            .options(
                joinedload(Board.columns).joinedload(Column.cards)
            )
            .filter(Board.id == board_id)
            .first()
        )
