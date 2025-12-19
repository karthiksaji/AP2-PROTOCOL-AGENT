import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.shopping_agent import ShoppingAgent
from agents.merchant_agent import MerchantAgent
from agents.credentials_provider_agent import CredentialsProviderAgent
from agents.payment_processor_agent import PaymentProcessorAgent

# Initialize Agents
merchant = MerchantAgent()
credentials_provider = CredentialsProviderAgent()
payment_processor = PaymentProcessorAgent()
shopping_agent = ShoppingAgent(merchant, credentials_provider, payment_processor)

app = FastAPI()

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IntentRequest(BaseModel):
    prompt: str

class PaymentRequest(BaseModel):
    paymentMethod: str

class UpdateProductRequest(BaseModel):
    product_id: str
    name: str
    price: float
    currency: str = "INR"
    description: str = ""
    brand: str = ""
    merchant: str = "CoffeeRoasters"

@app.post("/intent")
async def process_intent(req: IntentRequest):
    result = shopping_agent.process_intent(req.prompt)
    if not result["product"]:
        # Return 200 but with empty product to let frontend handle "Not Found" logic
        # or we could return 404. The frontend expects { product: ... }
        return result
    return result

@app.post("/update-product")
async def update_product(req: UpdateProductRequest):
    """Update the cart mandate when user selects a different product"""
    product_dict = {
        "product_id": req.product_id,
        "name": req.name,
        "price": req.price,
        "currency": req.currency,
        "description": req.description,
        "brand": req.brand,
        "merchant": req.merchant
    }
    
    # Create new cart mandate for the selected product
    cart_mandate = merchant.create_cart_mandate(product_dict)
    shopping_agent.current_cart_mandate = cart_mandate
    
    return {"status": "success", "message": f"Cart updated to {req.name} at {req.price}"}

@app.post("/pay")
async def process_payment(req: PaymentRequest):
    result = shopping_agent.process_payment(req.paymentMethod)
    return result

if __name__ == "__main__":
    print("Starting AP2 Backend Server on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
