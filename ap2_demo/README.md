# AP2 Protocol Agent - Backend

A Python-based multi-agent system that orchestrates autonomous e-commerce transactions using the Agent Payments Protocol (AP2).

## Prerequisites

Before setting up this project, ensure you have:

- **Python 3.8 or higher** installed ([Download Python](https://www.python.org/downloads/))
- **pip** (Python package manager, comes with Python)
- **OpenRouter API Key** ([Get free API key](https://openrouter.ai/keys))

## Installation Steps

Follow these steps to set up the backend on a new system:

### 1. Navigate to the Backend Directory

```bash
cd "c:\Users\karthik.s\Desktop\ap2 protocol agent\ap2_demo"
```

Or if you're already in the project root:

```bash
cd ap2_demo
```

### 2. Install Python Dependencies

Install all required packages using pip:

```bash
pip install -r requirements.txt
```

This will install:
- `fastapi` - Modern web framework
- `uvicorn` - ASGI server for running FastAPI
- `openai` - LLM API client for product search
- `python-dotenv` - Environment variable management
- `pydantic` - Data validation

**Verify installation:**
```bash
pip list | findstr "fastapi uvicorn openai python-dotenv"
```

### 3. Configure Environment Variables

Create a `.env` file in the `ap2_demo` directory:

**Option A: Copy from example (recommended)**
```bash
copy .env.example .env
```

**Option B: Create manually**
Create a file named `.env` with the following content:
```
OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
```

**Get your OpenRouter API Key:**
1. Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key and paste it in your `.env` file

> **⚠️ Important:** Never commit the `.env` file to version control. It contains sensitive credentials.

## Running the Application

The backend can be run in two modes:

### Mode 1: FastAPI Server (Recommended for Frontend Integration)

Start the FastAPI server on port 8000:

```bash
python server.py
```

You should see:
```
Starting AP2 Backend Server on port 8000...
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**API Documentation:** Once running, visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API documentation.

### Mode 2: CLI Demo (For Testing)

Run the command-line demo:

```bash
python main.py
```

Follow the prompts to test the agent workflow interactively.

## Verification

After installation, verify everything works correctly:

### 1. Check Server is Running

Ensure the server is running (see "Running the Application" above).

### 2. Run Verification Script

In a **new terminal window**, run:

```bash
python verify_server.py
```

**Expected output:**
```
Sending request to http://localhost:8000/intent...

--- Server Response ---
{
  "product": {
    "name": "...",
    "price": ...,
    "merchant": "CoffeeRoasters",
    "brand": "..."
  },
  ...
}

--- Verification ---
Name: ...
Merchant: CoffeeRoasters
Brand: ...
SUCCESS: Merchant/Brand data is present.
```

### 3. Test API Endpoints

**Using Browser:**
- Open [http://localhost:8000/docs](http://localhost:8000/docs)
- Try the `/intent` endpoint with `{"prompt": "iphone 16"}`

**Using curl (PowerShell):**
```powershell
curl -X POST http://localhost:8000/intent -H "Content-Type: application/json" -d '{\"prompt\": \"iphone 16\"}'
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/intent` | POST | Process user's purchase intent and return product options |
| `/update-product` | POST | Update cart when user selects a different product |
| `/pay` | POST | Process payment for current cart |
| `/docs` | GET | Interactive API documentation (Swagger UI) |

## Project Structure

```
ap2_demo/
├── agents/
│   ├── shopping_agent.py           # Main orchestrator
│   ├── merchant_agent.py           # Product search (uses OpenRouter LLM)
│   ├── credentials_provider_agent.py  # Payment token generation
│   └── payment_processor_agent.py  # Transaction processing
├── mandates.py                     # Data structures for agent communication
├── server.py                       # FastAPI application
├── main.py                         # CLI demo
├── verify_server.py                # Verification script
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables (create this)
├── .env.example                   # Environment template
└── README.md                      # This file
```

## Troubleshooting

### Issue: `ModuleNotFoundError: No module named 'fastapi'`
**Solution:** Install dependencies:
```bash
pip install -r requirements.txt
```

### Issue: `AuthenticationError: Invalid API key`
**Solution:** 
1. Check your `.env` file exists in the `ap2_demo` directory
2. Verify your `OPENROUTER_API_KEY` is correct
3. Ensure there are no extra spaces or quotes around the key

### Issue: `Address already in use` or port 8000 is busy
**Solution:** 
1. Stop any other process using port 8000
2. Or modify `server.py` to use a different port:
   ```python
   uvicorn.run(app, host="0.0.0.0", port=8001)  # Change to 8001
   ```

### Issue: Server starts but `/intent` returns errors
**Solution:**
1. Check server logs for error messages
2. Verify your OpenRouter API key is valid and has credits
3. Test the API key directly at [https://openrouter.ai](https://openrouter.ai)

### Issue: `verify_server.py` fails with connection error
**Solution:** Ensure the server is running in another terminal window before running the verification script.

## Next Steps

- **Frontend Integration:** See [../ap2-frontend/README.md](../ap2-frontend/README.md) for frontend setup
- **Detailed Documentation:** See [../documentation/BACKEND.md](../documentation/BACKEND.md) for architecture details
- **API Reference:** Visit `/docs` endpoint when server is running

## Support

For detailed technical documentation, see:
- [Backend Architecture](../documentation/BACKEND.md)
- [API Reference](../documentation/API_REFERENCE.md) (if available)
