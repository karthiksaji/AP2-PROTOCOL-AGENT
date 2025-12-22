# Backend Documentation

## Overview

The AP2 Commerce Demo backend is a Python-based multi-agent system that orchestrates autonomous e-commerce transactions using the Agent Payments Protocol (AP2).

## Technology Stack

- **Python 3.8+**
- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **OpenRouter** - LLM API provider (meta-llama/llama-3.3-70b-instruct)
- **Pydantic** - Data validation
- **python-dotenv** - Environment management

## Project Structure

```
ap2_demo/
├── agents/
│   ├── __init__.py
│   ├── shopping_agent.py           # Main orchestrator
│   ├── merchant_agent.py           # Product search
│   ├── credentials_provider_agent.py  # Payment tokens
│   └── payment_processor_agent.py  # Transaction processing
├── mandates.py                     # Data structures
├── server.py                       # FastAPI application
├── main.py                         # CLI demo
├── .env                           # Environment variables
└── requirements.txt               # Dependencies
```

## Architecture

### Multi-Agent System

The backend follows a **microservices-inspired agent architecture** where each agent has a specific responsibility:

```
┌─────────────────┐
│  Shopping Agent │ (Orchestrator)
└────────┬────────┘
         │
    ┌────┴────┬────────────┬──────────────┐
    │         │            │              │
┌───▼───┐ ┌──▼──┐ ┌───────▼────┐ ┌──────▼────┐
│Merchant│ │Creds│ │   Payment  │ │  Mandate  │
│ Agent  │ │Agent│ │  Processor │ │  System   │
└────────┘ └─────┘ └────────────┘ └───────────┘
```

## Core Components

### 1. Shopping Agent (`shopping_agent.py`)

**Purpose:** Main orchestrator that coordinates the entire purchase workflow.

**Key Methods:**

#### `process_intent(prompt: str) -> dict`

Handles user's purchase intent and returns product options.

**Flow:**
1. Create IntentMandate
2. Call MerchantAgent to search products
3. Select best match
4. Create CartMandate
5. Return product details and logs

**Returns:**
```python
{
    "product": {
        "name": str,
        "price": float,
        "brand": str,
        "merchant": str
    },
    "alternatives": [Product, ...],
    "agentLogs": [
        {"agent": "ShoppingAgent", "message": "..."},
        ...
    ]
}
```

#### `process_payment(payment_method: str) -> dict`

Processes payment for the current cart.

**Flow:**
1. Get payment token from CredentialsProvider
2. Create PaymentMandate
3. Submit to PaymentProcessor
4. Return receipt

**Returns:**
```python
{
    "status": "SUCCESS",
    "receiptId": str,
    "agentLogs": [...]
}
```

**State Management:**
```python
self.current_cart_mandate = None  # Current cart
self.logs = []                     # Agent logs
```

### 2. Merchant Agent (`merchant_agent.py`)

**Purpose:** Discovers and returns product options using LLM.

**Key Methods:**

#### `search_product(query: str) -> list[dict]`

Searches for products matching the query using OpenRouter LLM.

**LLM Integration:**
```python
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)
model = "llama-3.3-70b-versatile"
```

**System Prompt:**
```
You are a merchant product search system. Given a user query, 
return UP TO 3 realistic variants of the SAME product with 
different specifications or models.
```

**Response Format:**
```json
{
  "products": [
    {
      "name": "Apple iPhone 16 (6GB RAM, 128GB Storage, Space Grey)",
      "price": 64999.0,
      "currency": "INR",
      "description": "Latest iPhone with A18 chip",
      "brand": "Apple",
      "merchant": "CoffeeRoasters"
    },
    ...
  ]
}
```

**Product Limit:** Enforced maximum of 3 products via `results[:3]`

#### `create_cart_mandate(product: dict) -> dict`

Creates a cryptographically signed cart mandate.

**Returns:**
```python
{
    "mandate_id": "cart_<uuid>",
    "type": "CartMandate",
    "product": {...},
    "signature": "<sha256_hash>",
    "timestamp": <unix_timestamp>
}
```

### 3. Credentials Provider Agent (`credentials_provider_agent.py`)

**Purpose:** Generates secure payment tokens for transactions.

**Key Methods:**

#### `get_payment_methods() -> list[dict]`

Returns available payment methods.

**Returns:**
```python
[
    {
        "method_id": "card_1",
        "type": "credit_card",
        "last4": "1234",
        "provider": "HDFC Bank"
    },
    {
        "method_id": "upi_1",
        "type": "upi",
        "upi_id": "user@upi"
    }
]
```

#### `generate_payment_token(method_id: str, amount: float) -> dict`

Generates a secure token for payment.

**Returns:**
```python
{
    "token": "tok_<uuid>",
    "method_id": str,
    "amount": float,
    "currency": "INR",
    "expires_at": <timestamp>
}
```

**Security:** Tokens are single-use and amount-specific.

### 4. Payment Processor Agent (`payment_processor_agent.py`)

**Purpose:** Validates and processes payment transactions.

**Key Methods:**

#### `process_payment(payment_mandate: dict) -> dict`

Processes the payment mandate and returns a receipt.

**Validation Steps:**
1. Verify mandate signature
2. Validate payment token
3. Check amount consistency
4. Process transaction

**Returns:**
```python
{
    "transaction_id": "txn_<mandate_id>",
    "status": "SUCCESS",
    "amount": float,
    "currency": "INR",
    "timestamp": <unix_timestamp>,
    "payment_method": str
}
```

**Error Handling:**
- Invalid signature → Reject
- Token mismatch → Reject
- Amount mismatch → Reject

### 5. Mandates System (`mandates.py`)

**Purpose:** Data structures for agent communication.

**Mandate Types:**

#### IntentMandate
```python
{
    "mandate_id": "intent_<uuid>",
    "type": "IntentMandate",
    "user_prompt": str,
    "timestamp": <unix_timestamp>
}
```

#### CartMandate
```python
{
    "mandate_id": "cart_<uuid>",
    "type": "CartMandate",
    "product": {...},
    "signature": str,
    "timestamp": <unix_timestamp>
}
```

#### PaymentMandate
```python
{
    "mandate_id": "pay_<uuid>",
    "type": "PaymentMandate",
    "cart_mandate_id": str,
    "payment_token": str,
    "amount": float,
    "signature": str,
    "timestamp": <unix_timestamp>
}
```

**Signature Generation:**
```python
import hashlib
import json

def sign_mandate(mandate: dict) -> str:
    data = json.dumps(mandate, sort_keys=True)
    return hashlib.sha256(data.encode()).hexdigest()
```

## FastAPI Server (`server.py`)

### Endpoints

#### POST `/intent`

**Purpose:** Process user's purchase intent.

**Request:**
```json
{
  "prompt": "iphone 16"
}
```

**Response:**
```json
{
  "product": {...},
  "alternatives": [...],
  "agentLogs": [...]
}
```

**Implementation:**
```python
@app.post("/intent")
async def process_intent(req: IntentRequest):
    result = shopping_agent.process_intent(req.prompt)
    return result
```

#### POST `/update-product`

**Purpose:** Update cart mandate when user selects a different product.

**Request:**
```json
{
  "product_id": "prod_abc123",
  "name": "Apple iPhone 16 Pro",
  "price": 84999.0,
  "currency": "INR",
  "brand": "Apple",
  "merchant": "CoffeeRoasters"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Cart updated to Apple iPhone 16 Pro at 84999.0"
}
```

**Implementation:**
```python
@app.post("/update-product")
async def update_product(req: UpdateProductRequest):
    product_dict = req.dict()
    cart_mandate = merchant.create_cart_mandate(product_dict)
    shopping_agent.current_cart_mandate = cart_mandate
    return {"status": "success", "message": f"Cart updated..."}
```

#### POST `/pay`

**Purpose:** Process payment for current cart.

**Request:**
```json
{
  "paymentMethod": "card_1"
}
```

**Response:**
```json
{
  "status": "SUCCESS",
  "receiptId": "txn_pay_abc123",
  "agentLogs": [...]
}
```

**Implementation:**
```python
@app.post("/pay")
async def process_payment(req: PaymentRequest):
    result = shopping_agent.process_payment(req.paymentMethod)
    return result
```

### CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Agent Communication Flow

### Complete Purchase Flow

```
1. User submits "iphone 16"
   ↓
2. ShoppingAgent.process_intent()
   ↓
3. MerchantAgent.search_product("iphone 16")
   ↓ (OpenRouter LLM)
4. Returns 3 iPhone variants
   ↓
5. ShoppingAgent selects best match
   ↓
6. MerchantAgent.create_cart_mandate()
   ↓
7. Return to frontend
   ↓
8. User clicks "Proceed to Payment"
   ↓
9. ShoppingAgent.process_payment("card_1")
   ↓
10. CredentialsProvider.generate_payment_token()
    ↓
11. ShoppingAgent creates PaymentMandate
    ↓
12. PaymentProcessor.process_payment()
    ↓
13. Return receipt to frontend
```

### Agent Logging

Each agent logs its actions:

```python
self.logs.append({
    "agent": "ShoppingAgent",
    "message": "IntentMandate created for 'iphone 16'"
})
```

Logs are aggregated and returned to the frontend for visualization.

## Environment Configuration

### Required Variables

```bash
# .env
OPENROUTER_API_KEY=sk-or-v1-...
```

### Loading Environment

```python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENROUTER_API_KEY")
```

## Error Handling

### Product Not Found

```python
if not results:
    return None  # Frontend handles gracefully
```

### LLM Errors

```python
try:
    response = client.chat.completions.create(...)
except Exception as e:
    print(f"[CoffeeRoasters] LLM Error: {e}")
    return None
```

### Payment Failures

```python
if not verify_signature(payment_mandate):
    raise ValueError("Invalid payment mandate signature")
```

## CLI Demo (`main.py`)

**Purpose:** Test agents via command line.

**Usage:**
```bash
python main.py
```

**Example:**
```
Enter your shopping request: iphone 16
[ShoppingAgent] Processing User Request: 'iphone 16'
[ShoppingAgent] Created IntentMandate: intent_abc123
[CoffeeRoasters] Searching for product matching: 'iphone 16'
[CoffeeRoasters] Found 3 matches. Best: Apple iPhone 16 (64999.0 INR)
...
```

## Running the Server

### Development Mode

```bash
python server.py
```

### Production Mode

```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

### With Auto-Reload

```bash
uvicorn server:app --reload
```

## Testing

### Manual API Testing

```bash
# Test intent endpoint
curl -X POST http://localhost:8000/intent \
  -H "Content-Type: application/json" \
  -d '{"prompt": "iphone 16"}'

# Test payment endpoint
curl -X POST http://localhost:8000/pay \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod": "card_1"}'
```

### Python Testing

```python
import requests

# Test intent
response = requests.post(
    "http://localhost:8000/intent",
    json={"prompt": "iphone 16"}
)
print(response.json())
```

## Performance Considerations

1. **LLM Latency:** API calls typically take 1-3 seconds
2. **Caching:** Consider caching popular product queries
3. **Rate Limiting:** Implement for production
4. **Connection Pooling:** For database connections (if added)

## Security Best Practices

1. **API Keys:** Never commit `.env` to version control
2. **Mandate Signatures:** Validate all signatures
3. **Token Expiry:** Implement token expiration
4. **Input Validation:** Use Pydantic models
5. **CORS:** Restrict origins in production

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Redis caching for products
- [ ] Rate limiting middleware
- [ ] Authentication & authorization
- [ ] Webhook support for async payments
- [ ] Transaction history storage
- [ ] Product inventory management
- [ ] Multi-merchant support

---

For API endpoint details, see [API Reference](./API_REFERENCE.md).
