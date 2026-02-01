from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.column import ColumnCreate, ColumnResponse
from app.services.column_service import ColumnService

router = APIRouter(prefix="/boards/{board_id}/columns", tags=["columns"])


@router.post("", response_model=ColumnResponse)
def create_column(board_id: str, data: ColumnCreate, db: Session = Depends(get_db)):
    service = ColumnService(db)
    column = service.create_column(board_id, data)
    if not column:
        raise HTTPException(status_code=404, detail="Board not found")
    return column
