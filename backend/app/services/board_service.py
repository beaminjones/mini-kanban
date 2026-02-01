from __future__ import annotations
from sqlalchemy.orm import Session

from app.repositories.board_repository import BoardRepository
from app.schemas.board import BoardCreate, BoardDetailResponse, BoardResponse


class BoardService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = BoardRepository()

    def create_board(self, data: BoardCreate) -> BoardResponse:
        board = self.repository.create(self.db, data.name)
        return BoardResponse.model_validate(board)

    def list_boards(self) -> list[BoardResponse]:
        boards = self.repository.get_all(self.db)
        return [BoardResponse.model_validate(b) for b in boards]

    def get_board(self, board_id: str) -> BoardDetailResponse | None:
        board = self.repository.get_by_id_with_columns_and_cards(self.db, board_id)
        if not board:
            return None
        return BoardDetailResponse.model_validate(board)
