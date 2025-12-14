from pydantic import BaseModel
from typing import Optional
from enum import Enum

class DealType(str, Enum):
    TICKET = "ticket"
    FLIGHT = "flight"
    HOTEL = "hotel"

class Deal(BaseModel):
    id: str
    type: DealType
    title: str
    old_price: float
    new_price: float
    drop_percentage: float
    url: str
    image_url: Optional[str] = None
    description: Optional[str] = None
    deal_score: int = 50 # 0-100
    visual_tag: Optional[str] = None # e.g. "🔥", "💎"
