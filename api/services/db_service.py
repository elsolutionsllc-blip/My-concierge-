import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

# Initialize Supabase client if keys exist
if url and key:
    supabase: Client = create_client(url, key)
else:
    # Mock or None if keys are missing
    supabase = None

def get_user_premium_status(user_id: str) -> bool:
    """
    Checks if a user is premium.
    For this MVP, if no DB connection, returns False (Free Tier).
    """
    if not supabase:
        return False
    
    try:
        response = supabase.table("users").select("is_premium").eq("id", user_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0].get("is_premium", False)
    except Exception as e:
        print(f"DB Error: {e}")
        
    return False

def update_user_premium(user_id: str, status: bool = True):
    if not supabase:
        print("Mock: Updated user premium status")
        return

    try:
        supabase.table("users").update({"is_premium": status}).eq("id", user_id).execute()
    except Exception as e:
        print(f"DB Error updating user: {e}")
