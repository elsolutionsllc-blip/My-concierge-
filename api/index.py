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

# Mock data for MVP
mock_deals = [
    {
        "id": "1",
        "type": "flight",
        "title": "NYC to LA Flight",
        "old_price": 450,
        "new_price": 299,
        "drop_percentage": 33,
        "url": "https://example.com",
        "image_url": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500&h=300&fit=crop",
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
        "image_url": "https://images.unsplash.com/photo-1586368899136-1b179786357b?w=500&h=300&fit=crop",
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
        "image_url": "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&h=300&fit=crop",
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
        "image_url": "https://images.unsplash.com/photo-1565073225503-7f41e4995d25?w=500&h=300&fit=crop",
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
        "image_url": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
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
        "image_url": "https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=500&h=300&fit=crop",
        "description": "Business class upgrade",
        "panic_score": 90,
        "visual_tag": "Premium"
    }
]

@app.get("/api/deals")
async def get_deals():
    return mock_deals

@app.get("/api/user/{user_id}/status")
async def get_user_status(user_id: str):
    return {"is_premium": False}

@app.get("/api")
async def health_check():
    return {"status": "ok", "service": "PanicDeals API"}
