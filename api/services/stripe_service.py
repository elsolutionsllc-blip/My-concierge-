import stripe
import os
from fastapi import Request

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
DOMAIN = "http://localhost:3000"

def create_checkout_session_url(user_id: str, email: str):
    if not stripe.api_key:
        return f"{DOMAIN}/success?mock=true"

    try:
        checkout_session = stripe.checkout.Session.create(
            customer_email=email,
            client_reference_id=user_id,
            line_items=[
                {
                    # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    # For MVP, we can assume a placeholder or dynamic pricing if allowed
                    'price_data': {
                         'currency': 'usd',
                         'product_data': {
                             'name': 'My Concierge - Private Access',
                             'description': 'Unlock hidden flight gems and panic drops.',
                         },
                         'unit_amount': 900, # $9.00
                         'recurring': {
                             'interval': 'month',
                         },
                    },
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=DOMAIN + '/?success=true',
            cancel_url=DOMAIN + '/?canceled=true',
        )
        return checkout_session.url
    except Exception as e:
        print(f"Stripe Error: {e}")
        return None
