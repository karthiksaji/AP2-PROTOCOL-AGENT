# API Reference

Complete reference for the AP2 Commerce Demo REST API.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, no authentication is required. This is a demo application.

---

## Endpoints

### 1. Process Intent

Process user's purchase intent and return product options.

**Endpoint:** `POST /intent`

**Request Body:**
```json
{
  "prompt": "string"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| prompt | string | Yes | User's product search query |

**Example Request:**
```bash
curl -X POST http://localhost:8000/intent \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "iphone 16"
  }'
```

**Success Response (200 OK):**
```json
{
  "product": {
    "name": "Apple iPhone 16 (6GB RAM, 128GB Storage, Space Grey)",
    "price": 64999.0,
    "brand": "Apple",
    "merchant": "CoffeeRoasters"
  },
  "alternatives": [
    {
      "name": "Apple iPhone 16 (6GB RAM, 128GB Storage, Space Grey)",
      "price": 64999.0,
      "brand": "Apple",
      "merchant": "CoffeeRoasters"
    },
    {
      "name": "Apple iPhone 16 (8GB RAM, 256GB Storage, Midnight Blue)",
      "price": 74999.0,
      "brand": "Apple",
      "merchant": "CoffeeRoasters"
    },
    {
      "name": "Apple iPhone 16 Pro (12GB RAM, 512GB Storage, Gold)",
      "price": 84999.0,
      "brand": "Apple",
      "merchant": "CoffeeRoasters"
    }
  ],
  "agentLogs": [
    {
      "agent": "ShoppingAgent",
      "message": "IntentMandate created for 'iphone 16'"
    },
    {
      "agent": "ShoppingAgent",
      "message": "Routing request to MerchantAgent..."
    },
    {
      "agent": "MerchantAgent",
      "message": "Product search: found 3 matches"
    },
    {
      "agent": "MerchantAgent",
      "message": "CartMandate signed for Apple iPhone 16"
    }
  ]
}
```

**Product Not Found Response (200 OK):**
```json
{
  "product": null,
  "alternatives": [],
  "agentLogs": [
    {
      "agent": "ShoppingAgent",
      "message": "IntentMandate created for 'xyz123'"
    },
    {
      "agent": "MerchantAgent",
      "message": "No products found for query: 'xyz123'"
    },
    {
      "agent": "ShoppingAgent",
      "message": "Aborting flow: Product not found"
    }
  ]
}
```

---

### 2. Update Product Selection

Update the cart mandate when user selects a different product.

**Endpoint:** `POST /update-product`

**Request Body:**
```json
{
  "product_id": "string",
  "name": "string",
  "price": number,
  "currency": "string",
  "description": "string",
  "brand": "string",
  "merchant": "string"
}
```

**Parameters:**
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| product_id | string | Yes | - | Unique product identifier |
| name | string | Yes | - | Product name |
| price | number | Yes | - | Product price |
| currency | string | No | "INR" | Currency code |
| description | string | No | "" | Product description |
| brand | string | No | "" | Brand name |
| merchant | string | No | "CoffeeRoasters" | Merchant name |

**Example Request:**
```bash
curl -X POST http://localhost:8000/update-product \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_abc123",
    "name": "Apple iPhone 16 Pro",
    "price": 84999.0,
    "currency": "INR",
    "description": "Pro model with advanced features",
    "brand": "Apple",
    "merchant": "CoffeeRoasters"
  }'
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Cart updated to Apple iPhone 16 Pro at 84999.0"
}
```

---

### 3. Process Payment

Process payment for the current cart.

**Endpoint:** `POST /pay`

**Request Body:**
```json
{
  "paymentMethod": "string"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| paymentMethod | string | Yes | Payment method ID (e.g., "card_1", "upi_1") |

**Available Payment Methods:**
- `card_1` - HDFC Credit Card (•••• 1234)
- `upi_1` - UPI (user@upi)

**Example Request:**
```bash
curl -X POST http://localhost:8000/pay \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "card_1"
  }'
```

**Success Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "receiptId": "txn_pay_abc123",
  "agentLogs": [
    {
      "agent": "CredentialsProvider",
      "message": "Retrieving payment methods..."
    },
    {
      "agent": "CredentialsProvider",
      "message": "Generated secure payment token: tok_xyz789 for amount 64999.0"
    },
    {
      "agent": "ShoppingAgent",
      "message": "PaymentMandate constructed and signed: pay_abc123"
    },
    {
      "agent": "PaymentProcessor",
      "message": "Verifying PaymentMandate signature..."
    },
    {
      "agent": "PaymentProcessor",
      "message": "Verifying token tok_xyz789 for amount 64999.0..."
    },
    {
      "agent": "PaymentProcessor",
      "message": "Transaction authorized."
    },
    {
      "agent": "PaymentProcessor",
      "message": "Transaction authorized. Receipt: txn_pay_abc123"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "detail": "No cart mandate available. Please select a product first."
}
```

---

## Data Models

### Product

```typescript
{
  name: string;        // Product name
  price: number;       // Price in INR
  brand?: string;      // Brand name (optional)
  merchant?: string;   // Merchant name (optional)
}
```

### Agent Log

```typescript
{
  agent: string;       // Agent name (e.g., "ShoppingAgent")
  message: string;     // Log message
  timestamp?: number;  // Unix timestamp (optional)
}
```

### Intent Response

```typescript
{
  product: Product | null;      // Selected product or null if not found
  alternatives?: Product[];     // Alternative products (up to 3)
  agentLogs: AgentLog[];       // Agent communication logs
}
```

### Payment Response

```typescript
{
  status: string;          // "SUCCESS" or "FAILED"
  receiptId: string;       // Transaction receipt ID
  agentLogs: AgentLog[];   // Agent communication logs
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (invalid input) |
| 404 | Not Found |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "detail": "Error message description"
}
```

### Common Errors

**Missing Cart Mandate:**
```json
{
  "detail": "No cart mandate available. Please select a product first."
}
```

**Invalid Payment Method:**
```json
{
  "detail": "Invalid payment method ID"
}
```

**LLM API Error:**
```json
{
  "detail": "Product search failed. Please try again."
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production use, implement rate limiting middleware.

**Recommended Limits:**
- `/intent`: 10 requests per minute per IP
- `/pay`: 5 requests per minute per IP
- `/update-product`: 20 requests per minute per IP

---

## CORS

CORS is enabled for all origins in development:

```python
allow_origins=["*"]
```

**Production Configuration:**
```python
allow_origins=[
    "https://yourdomain.com",
    "https://app.yourdomain.com"
]
```

---

## Webhooks

Not currently implemented. Future enhancement for async payment notifications.

---

## Versioning

Current API version: **v1** (implicit)

Future versions will use URL versioning:
- `/v1/intent`
- `/v2/intent`

---

## Testing

### Postman Collection

Import this collection for easy testing:

```json
{
  "info": {
    "name": "AP2 Commerce Demo API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Process Intent",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"prompt\": \"iphone 16\"}"
        },
        "url": {
          "raw": "http://localhost:8000/intent",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8000",
          "path": ["intent"]
        }
      }
    }
  ]
}
```

### cURL Examples

**Search for Product:**
```bash
curl -X POST http://localhost:8000/intent \
  -H "Content-Type: application/json" \
  -d '{"prompt": "samsung galaxy s24"}'
```

**Update Product Selection:**
```bash
curl -X POST http://localhost:8000/update-product \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_123",
    "name": "Samsung Galaxy S24 Ultra",
    "price": 124999.0,
    "brand": "Samsung",
    "merchant": "TechStore"
  }'
```

**Process Payment:**
```bash
curl -X POST http://localhost:8000/pay \
  -H "Content-Type: application/json" \
  -d '{"paymentMethod": "card_1"}'
```

---

## SDK Examples

### JavaScript/TypeScript

```typescript
const API_BASE = 'http://localhost:8000';

// Search for products
async function searchProducts(prompt: string) {
  const response = await fetch(`${API_BASE}/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  return await response.json();
}

// Process payment
async function processPayment(paymentMethod: string) {
  const response = await fetch(`${API_BASE}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentMethod })
  });
  return await response.json();
}
```

### Python

```python
import requests

API_BASE = "http://localhost:8000"

# Search for products
def search_products(prompt: str):
    response = requests.post(
        f"{API_BASE}/intent",
        json={"prompt": prompt}
    )
    return response.json()

# Process payment
def process_payment(payment_method: str):
    response = requests.post(
        f"{API_BASE}/pay",
        json={"paymentMethod": payment_method}
    )
    return response.json()
```

---

## Support

For API issues or questions:
1. Check the [Backend Documentation](./BACKEND.md)
2. Review agent logs for debugging
3. Ensure OpenRouter API key is configured correctly

---

**Last Updated:** December 2024
