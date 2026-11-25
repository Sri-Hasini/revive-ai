
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Literal

from backend.services.recommender import recommend_action

router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendations"]
)


# Input data model
class ItemRequest(BaseModel):
    item_name: str
    category: str
    condition: Literal["excellent", "good", "fair", "poor"]
    working: bool
    age_years: int = Field(ge=0, le=1000)
    repairable: bool


# Generate recommendation
@router.post("/generate")
def generate_recommendation(item: ItemRequest):

    result = recommend_action(
        item_name=item.item_name,
        category=item.category,
        condition=item.condition,
        working=item.working,
        age_years=item.age_years,
        repairable=item.repairable
    )

    return result
