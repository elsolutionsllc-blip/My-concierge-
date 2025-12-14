from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="PanicDeals API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from clients.seatgeek import get_ticket_deals
from services.travel_service import get_travel_deals
from services.stripe_service import create_checkout_session_url
from services.db_service import update_user_premium, get_user_premium_status, supabase
from typing import List, Optional
from models import Deal
from fastapi import Request, HTTPException
import pydantic

class CheckoutRequest(pydantic.BaseModel):
    user_id: str
    email: str

from jobs.cron_fetch_deals import fetch_and_sync
from fastapi import BackgroundTasks

@app.get("/api/deals")
async def get_deals():
    # Async Polling Architecture: Read from The Vault
    if not supabase:
         # Fallback for local testing if DB not connected
         print("DB Connection missing, falling back to Mock Live Fetch")
         tickets = await get_ticket_deals()
         travel = await get_travel_deals()
         return tickets + travel

    try:
        response = supabase.table("active_deals").select("*").order("panic_score", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"DB Read Error: {e}")
        raise HTTPException(status_code=500, detail="Vault Locked")

@app.get("/api/cron")
async def trigger_cron(background_tasks: BackgroundTasks):
    # Trigger the worker in background
    background_tasks.add_task(fetch_and_sync)
    return {"status": "Worker Started"}

@app.post("/api/create-checkout-session")
async def create_checkout_session(request: CheckoutRequest):
    url = create_checkout_session_url(request.user_id, request.email)
    return {"url": url}

@app.post("/api/webhook")
async def stripe_webhook(request: Request):
    # Simplified webhook for MVP
    # In prod, verify signature
    payload = await request.json()
    event_type = payload.get("type")
    
    if event_type == "checkout.session.completed":
        session = payload.get("data", {}).get("object", {})
        client_reference_id = session.get("client_reference_id")
        if client_reference_id:
            update_user_premium(client_reference_id, True)
            
    return {"status": "success"}

@app.get("/api/user/{user_id}/status")
async def get_user_status(user_id: str):
    is_premium = get_user_premium_status(user_id)
    return {"is_premium": is_premium}

@app.get("/api")
async def health_check():
    return {"status": "ok", "service": "PanicDeals API"}
