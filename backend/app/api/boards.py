from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.board import BoardCreate, BoardResponse, BoardDetailResponse
from app.services.board_service import BoardService

router = APIRouter(prefix="/boards", tags=["boards"])


@router.post("", response_model=BoardResponse)
def create_board(data: BoardCreate, db: Session = Depends(get_db)):
    service = BoardService(db)
    return service.create_board(data)


@router.get("", response_model=list[BoardResponse])
def list_boards(db: Session = Depends(get_db)):
    service = BoardService(db)
    return service.list_boards()


@router.get("/{board_id}", response_model=BoardDetailResponse)
def get_board(board_id: str, db: Session = Depends(get_db)):
    service = BoardService(db)
    board = service.get_board(board_id)
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    return board
