from __future__ import annotations
from sqlalchemy.orm import Session

from app.models import Card, Column


class CardRepository:
    def create(self, db: Session, column_id: str, title: str, description=None) -> Card | None:
        column = db.query(Column).filter(Column.id == column_id).first()
        if not column:
            return None

        max_position = db.query(Card).filter(Card.column_id == column_id).count()
        card = Card(column_id=column_id, title=title, description=description, position=max_position)
        db.add(card)
        db.commit()
        db.refresh(card)
        return card

    def get_by_id(self, db: Session, card_id: str) -> Card | None:
        return db.query(Card).filter(Card.id == card_id).first()

    def update(self, db: Session, card: Card, title=None, description=None) -> Card:
        if title is not None:
            card.title = title
        if description is not None:
            card.description = description
        db.commit()
        db.refresh(card)
        return card

    def delete(self, db: Session, card: Card) -> None:
        db.delete(card)
        db.commit()

    def move(self, db: Session, card: Card, new_column_id: str) -> Card:
        card.column_id = new_column_id
        max_position = db.query(Card).filter(Card.column_id == new_column_id).count()
        card.position = max_position
        db.commit()
        db.refresh(card)
        return card
