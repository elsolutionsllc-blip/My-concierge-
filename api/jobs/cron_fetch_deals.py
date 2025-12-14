import asyncio
import os
import sys
from datetime import datetime
import json
from decimal import Decimal
from dotenv import load_dotenv

# Add parent directory to path to allow imports from api root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

from clients.seatgeek import get_ticket_deals
from services.travel_service import get_travel_deals
from models import Deal, DealType
from supabase import create_client, Client

# Environment Setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
# Prefer Service Role Key for writing, fallback to Anon (will likely fail RLS)
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase Credentials (URL or SERVICE_ROLE_KEY)")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def serialize_deal(deal: Deal):
    return {
        "id": deal.id,
        "source": "seatgeek" if deal.type == DealType.TICKET else "amadeus_mock",
        "title": deal.title,
        "price": float(deal.new_price),
        "old_price": float(deal.old_price),
        "panic_score": deal.deal_score,
        "drop_percentage": float(deal.drop_percentage),
        "url": deal.url,
        "image_url": deal.image_url,
        "description": deal.description,
        "visual_tag": deal.visual_tag,
        "type": deal.type.value,
        "last_updated_at": datetime.utcnow().isoformat()
    }

async def fetch_and_sync():
    print(f"[{datetime.now()}] Starting Job: The Worker")
    
    # 1. Fetch Data
    print("Fetching Tickets...")
    try:
        tickets = await get_ticket_deals()
    except Exception as e:
        print(f"Error fetching tickets: {e}")
        tickets = []

    print("Fetching Travel...")
    try:
        travel = await get_travel_deals()
    except Exception as e:
        print(f"Error fetching travel: {e}")
        travel = []
        
    all_deals = tickets + travel
    print(f"Found {len(all_deals)} total candidates.")
    
    # 2. Filter for Panic Drops (Logic > 20% or High Score)
    panic_deals = [d for d in all_deals if d.drop_percentage > 20 or (d.deal_score and d.deal_score > 80)]
    print(f"Filtered to {len(panic_deals)} Panic Deals.")
    
    # 3. Upsert to Supabase
    if not panic_deals:
        print("No deals to sync.")
        return

    data_to_upsert = [serialize_deal(d) for d in panic_deals]
    
    try:
        # Upsert in batches if needed, but for MVP just one go
        response = supabase.table("active_deals").upsert(data_to_upsert).execute()
        print(f"Successfully synced {len(data_to_upsert)} deals to The Vault.")
    except Exception as e:
        print(f"CRITICAL DB ERROR: {e}")
        print("Tip: Ensure SUPABASE_SERVICE_ROLE_KEY is set to bypass RLS.")

    # 4. Cleanup Old Deals (Ghost Tickets) calling a stored proc or just delete by timestamp
    # For now, we skip explicit delete as we don't have a 'delete_old_deals' RPC
    # and deleting by timestamp requires careful logic not to delete what we just added.
    
if __name__ == "__main__":
    asyncio.run(fetch_and_sync())
