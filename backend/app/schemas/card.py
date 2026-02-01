from typing import Optional
from pydantic import BaseModel, Field
from pydantic.fields import AliasChoices


class CardCreate(BaseModel):
    title: str = Field(min_length=1)
    description: Optional[str] = None


class CardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class CardMove(BaseModel):
    new_column_id: str = Field(validation_alias=AliasChoices("newColumnId", "new_column_id"))


class CardResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    column_id: str

    class Config:
        from_attributes = True
