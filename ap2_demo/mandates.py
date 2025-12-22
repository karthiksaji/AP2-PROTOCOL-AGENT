from dataclasses import dataclass
from typing import Optional

@dataclass
class IntentMandate:
    intent_id: str
    user_prompt: str

@dataclass
class CartMandate:
    cart_id: str
    product_name: str
    price: float
    merchant_signature: str

@dataclass
class PaymentMandate:
    payment_id: str
    cart_id: str
    amount: float
    payment_token: str
    user_signature: str
