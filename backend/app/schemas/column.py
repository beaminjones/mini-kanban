from pydantic import BaseModel, Field


class ColumnCreate(BaseModel):
    name: str = Field(min_length=1)


class ColumnResponse(BaseModel):
    id: str
    name: str
    board_id: str

    class Config:
        from_attributes = True
