from amadeus import Client, ResponseError
import os
from typing import List
from models import Deal, DealType
import random
from datetime import datetime, timedelta

AMADEUS_API_KEY = os.getenv("AMADEUS_API_KEY")
AMADEUS_API_SECRET = os.getenv("AMADEUS_API_SECRET")

# Initialize Amadeus client if keys exist, else None
if AMADEUS_API_KEY and AMADEUS_API_SECRET:
    amadeus = Client(client_id=AMADEUS_API_KEY, client_secret=AMADEUS_API_SECRET)
else:
    amadeus = None

async def get_travel_deals() -> List[Deal]:
    """
    Orchestrates fetching/mocking of Impulse Travel deals.
    """
    flights = await get_bougie_flights()
    hotels = await get_panic_hotels()
    return flights + hotels

async def get_bougie_flights() -> List[Deal]:
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    deals = []

    if amadeus:
        try:
            # Real API Logic would go here
            # For this MVP, we will fallback to Mock if specific search returns empty or just use Mock for demo stability
            # unless user explicitly wants to debug the Amadeus call.
            pass
        except ResponseError as error:
            print(f"Amadeus Error: {error}")

    # Fallback / Mock Logic for "Bougie Budget"
    # "Premium Economy" or "Business" < $400
    mock_gems = [
        {
            "dest": "LAS", "city": "Las Vegas", 
            "price": 129.00, "original": 450.00, 
            "class": "Business", "img": "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?auto=format&fit=crop&q=80&w=800"
        },
        {
            "dest": "MIA", "city": "Miami", 
            "price": 289.00, "original": 890.00, 
            "class": "First Class", "img": "https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&q=80&w=800"
        }
    ]

    for gem in mock_gems:
        drop = ((gem["original"] - gem["price"]) / gem["original"]) * 100
        deals.append(Deal(
            id=f"flight-{gem['dest']}-{random.randint(100,999)}",
            type=DealType.FLIGHT,
            title=f"💎 Hidden Gem to {gem['city']}",
            old_price=gem["original"],
            new_price=gem["price"],
            drop_percentage=round(drop, 1),
            url=f"https://www.google.com/travel/flights?q=flights+to+{gem['dest']}+on+{tomorrow}",
            image_url=gem["img"],
            description=f"{gem['class']} Seat • {tomorrow} Depart",
            deal_score=random.randint(85, 99),
            visual_tag="💎"
        ))
    
    return deals

async def get_panic_hotels() -> List[Deal]:
    # Mock "Tonight's Escapes"
    hotels = [
        {
            "name": "The Bellagio", "city": "Las Vegas",
            "price": 199, "old": 599, "stars": 5,
            "img": "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=800"
        },
        {
            "name": "1 Hotel South Beach", "city": "Miami",
            "price": 350, "old": 850, "stars": 5,
            "img": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800"
        }
    ]
    
    deals = []
    for h in hotels:
        drop = ((h["old"] - h["price"]) / h["old"]) * 100
        deals.append(Deal(
            id=f"hotel-{random.randint(1000,9999)}",
            type=DealType.HOTEL,
            title=f"{h['name']}",
            old_price=float(h["old"]),
            new_price=float(h["price"]),
            drop_percentage=round(drop, 1),
            url="https://www.expedia.com/", # Generic for mock
            image_url=h["img"],
            description=f"Tonight's Escape • {h['stars']} Star Luxury",
            deal_score=random.randint(90, 98),
            visual_tag="🔥"
        ))
    return deals
