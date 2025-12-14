import random
from typing import List
from models import Deal, DealType
from datetime import datetime, timedelta

async def get_flight_deals() -> List[Deal]:
    # Mock data for flights
    # In a real scenario, we would use Amadeus or Duffel API here
    
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    destinations = ["JFK", "LHR", "HND", "CDG", "DXB"]
    
    deals = []
    for _ in range(3):
        dest = random.choice(destinations)
        old_price = random.randint(300, 1000)
        discount = random.uniform(0.2, 0.5)
        new_price = old_price * (1 - discount)
        
        deals.append(Deal(
            id=f"flight-{random.randint(1000, 9999)}",
            type=DealType.FLIGHT,
            title=f"One-way to {dest}",
            old_price=float(old_price),
            new_price=run_round(new_price), # Helper or just round inline
            drop_percentage=round(discount * 100, 1),
            url=f"https://www.google.com/travel/flights?q=flights+to+{dest}+on+{tomorrow}",
            image_url="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=300",
            description=f"Last minute flight departing {tomorrow}"
        ))
    
    return deals

def run_round(num):
    return round(num, 2)
