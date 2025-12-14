import httpx
import os
from datetime import datetime, timedelta
from typing import List
from models import Deal, DealType

SEATGEEK_CLIENT_ID = os.getenv("SEATGEEK_CLIENT_ID")
BASE_URL = "https://api.seatgeek.com/2"

async def get_ticket_deals() -> List[Deal]:
    if not SEATGEEK_CLIENT_ID:
        # In a real app we'd log this warning.
        # For now, if no key, just return empty list to avoid crashing.
        print("Warning: SEATGEEK_CLIENT_ID not set.")
        return []

    # "Tomorrow" from "now" (User time is 2025-12-13, so tomorrow is 14th)
    tomorrow_start = (datetime.now() + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    datetime_str = tomorrow_start.strftime("%Y-%m-%dT%H:%M:%S")

    params = {
        "client_id": SEATGEEK_CLIENT_ID,
        "q": "Denver Broncos",
        "datetime_utc.gt": datetime_str,
        "sort": "score.desc",
        "per_page": 10
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{BASE_URL}/events", params=params)
            response.raise_for_status()
            data = response.json()
            
            deals = []
            for event in data.get("events", []):
                # Strict schema mapping
                stats = event.get("stats", {})
                lowest_price = stats.get("lowest_price")
                average_price = stats.get("average_price")
                listing_count = stats.get("listing_count", 0)
                score = event.get("score", 0)

                # Filter: score > 0.7 (as requested)
                # Also ensure we have pricing data to calculate drop
                if score > 0.7 and lowest_price and average_price:
                   if lowest_price < average_price:
                        drop = ((average_price - lowest_price) / average_price) * 100
                        
                        # Logic: "Panic Selling" if listing_count is high?
                        # We'll stick to the unified Deal model.
                        # Maybe add listing count to description.
                        
                        # Normalize score (0-1) to 0-100
                        deal_score = int(score * 100)
                        
                        visual_tag = None
                        if deal_score > 80:
                            visual_tag = "🔥"
                        
                        deals.append(Deal(
                            id=str(event["id"]),
                            type=DealType.TICKET,
                            title=event["short_title"],
                            old_price=float(average_price),
                            new_price=float(lowest_price),
                            drop_percentage=round(drop, 1),
                            url=event["url"],
                            image_url=event["performers"][0]["image"] if event.get("performers") else None,
                            description=f"Score: {score} | {listing_count} listings available at {event['venue']['name']}",
                            deal_score=deal_score,
                            visual_tag=visual_tag
                        ))
            return deals
        except Exception as e:
            print(f"Error fetching SeatGeek events: {e}")
            return []
