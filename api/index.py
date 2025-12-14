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
    # Mock data for MVP - returns sample deals
    mock_deals = [
        {
            "id": "1",
            "type": "flight",
            "title": "NYC to LA Flight",
            "old_price": 450,
            "new_price": 299,
            "drop_percentage": 33,
            "url": "https://example.com",
            "description": "Round trip economy",
            "panic_score": 95,
            "visual_tag": "Hot Deal"
        },
        {
            "id": "2",
            "type": "hotel",
            "title": "Luxury Resort in Bali",
            "old_price": 320,
            "new_price": 189,
            "drop_percentage": 41,
            "url": "https://example.com",
            "description": "5-star beachfront",
            "panic_score": 88,
            "visual_tag": "Flash Sale"
        },
        {
            "id": "3",
            "type": "flight",
            "title": "London to Paris Flight",
            "old_price": 250,
            "new_price": 120,
            "drop_percentage": 52,
            "url": "https://example.com",
            "description": "Direct flight",
            "panic_score": 92,
            "visual_tag": "Incredible"
        },
        {
            "id": "4",
            "type": "hotel",
            "title": "Miami Beach Hotel",
            "old_price": 280,
            "new_price": 155,
            "drop_percentage": 44,
            "url": "https://example.com",
            "description": "Oceanfront 4-star",
            "panic_score": 85,
            "visual_tag": "Limited Time"
        },
        {
            "id": "5",
            "type": "ticket",
            "title": "Taylor Swift Concert",
            "old_price": 350,
            "new_price": 199,
            "drop_percentage": 43,
            "url": "https://example.com",
            "description": "Front row seats",
            "panic_score": 98,
            "visual_tag": "VIP Access"
        },
        {
            "id": "6",
            "type": "flight",
            "title": "Tokyo from SF",
            "old_price": 650,
            "new_price": 425,
            "drop_percentage": 35,
            "url": "https://example.com",
            "description": "Business class upgrade",
            "panic_score": 90,
            "visual_tag": "Premium"
        }
    ]
    return mock_deals

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
