from typing import Optional
from pydantic import BaseModel, Field


class BoardCreate(BaseModel):
    name: str = Field(min_length=1)


class BoardResponse(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True


class ColumnInBoard(BaseModel):
    id: str
    name: str
    board_id: str

    class Config:
        from_attributes = True


class CardInColumn(BaseModel):
    id: str
    title: str
    description: Optional[str]
    column_id: str

    class Config:
        from_attributes = True


class ColumnWithCards(BaseModel):
    id: str
    name: str
    board_id: str
    cards: list[CardInColumn] = []

    class Config:
        from_attributes = True


class BoardDetailResponse(BaseModel):
    id: str
    name: str
    columns: list[ColumnWithCards] = []

    class Config:
        from_attributes = True
