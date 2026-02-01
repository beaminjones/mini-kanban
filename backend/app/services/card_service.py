from __future__ import annotations
from sqlalchemy.orm import Session

from app.repositories.card_repository import CardRepository
from app.repositories.column_repository import ColumnRepository
from app.schemas.card import CardCreate, CardUpdate, CardResponse, CardMove


class CardService:
    def __init__(self, db: Session):
        self.db = db
        self.card_repository = CardRepository()
        self.column_repository = ColumnRepository()

    def create_card(self, column_id: str, data: CardCreate) -> CardResponse | None:
        card = self.card_repository.create(self.db, column_id, data.title, data.description)
        if not card:
            return None
        return CardResponse.model_validate(card)

    def update_card(self, card_id: str, data: CardUpdate) -> CardResponse | None:
        card = self.card_repository.get_by_id(self.db, card_id)
        if not card:
            return None
        updated = self.card_repository.update(
            self.db, card,
            title=data.title,
            description=data.description
        )
        return CardResponse.model_validate(updated)

    def delete_card(self, card_id: str) -> bool:
        card = self.card_repository.get_by_id(self.db, card_id)
        if not card:
            return False
        self.card_repository.delete(self.db, card)
        return True

    def move_card(self, card_id: str, data: CardMove) -> CardResponse | None:
        card = self.card_repository.get_by_id(self.db, card_id)
        if not card:
            return None

        new_column = self.column_repository.get_by_id(self.db, data.new_column_id)
        if not new_column:
            return None

        if new_column.board_id != card.column.board_id:
            return None

        moved = self.card_repository.move(self.db, card, data.new_column_id)
        return CardResponse.model_validate(moved)
