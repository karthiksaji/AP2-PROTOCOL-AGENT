# Getting Started with AP2 Commerce Demo

This guide will help you set up and run the AP2 Commerce Demo on your local machine.

## Prerequisites

### Required Software

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **Python** 3.8 or higher ([Download](https://www.python.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** (for cloning the repository)

### API Keys

- **Groq API Key** - Required for LLM-powered product search
  - Sign up at [console.groq.com](https://console.groq.com/)
  - Generate an API key from your dashboard

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ap2-protocol-agent
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory

```bash
cd ap2_demo
```

#### 2.2 Create Virtual Environment (Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

**Required packages:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `groq` - Groq LLM client
- `python-dotenv` - Environment variable management
- `pydantic` - Data validation

#### 2.4 Configure Environment Variables

Create a `.env` file in the `ap2_demo` directory:

```bash
# .env
GROQ_API_KEY=your_groq_api_key_here
```

Replace `your_groq_api_key_here` with your actual Groq API key.

#### 2.5 Verify Backend Installation

Test the backend by running:

```bash
python main.py
```

You should see the CLI demo prompt. Type a product query like "iphone 16" to test.

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory

Open a **new terminal** and navigate to the frontend:

```bash
cd ap2-frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

**Key dependencies:**
- `react` - UI framework
- `react-dom` - React DOM renderer
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `lucide-react` - Icon library
- `clsx` - Utility for conditional classes

#### 3.3 Verify Frontend Installation

```bash
npm run dev
```

The development server should start at `http://localhost:5173`

## Running the Application

### Option 1: Full Stack (Recommended)

Run both backend and frontend simultaneously.

**Terminal 1 - Backend:**
```bash
cd ap2_demo
python server.py
```

Expected output:
```
Starting AP2 Backend Server on port 8000...
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
cd ap2-frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Access the Application:**
Open your browser and navigate to `http://localhost:5173`

### Option 2: Frontend Only (Mock Mode)

The frontend can run independently using mock data:

```bash
cd ap2-frontend
npm run dev
```

The application will automatically use mock responses if the backend is unavailable.

### Option 3: Backend CLI Demo

Test the backend agents via command line:

```bash
cd ap2_demo
python main.py
```

Enter product queries to see the agent workflow in action.

## Verification

### Backend Health Check

Test the backend API:

```bash
curl http://localhost:8000/intent -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt": "iphone 16"}'
```

You should receive a JSON response with product details and agent logs.

### Frontend Verification

1. Open `http://localhost:5173` in your browser
2. You should see the AP2 Commerce Demo interface
3. Try searching for "iphone 16"
4. Verify that products are displayed

## Common Issues

### Backend Issues

**Issue: `ModuleNotFoundError: No module named 'fastapi'`**
- **Solution:** Ensure you've activated the virtual environment and installed dependencies
  ```bash
  pip install -r requirements.txt
  ```

**Issue: `groq.APIError: Invalid API key`**
- **Solution:** Check your `.env` file and ensure `GROQ_API_KEY` is set correctly

**Issue: `Port 8000 already in use`**
- **Solution:** Kill the process using port 8000 or change the port in `server.py`
  ```bash
  # Windows
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -ti:8000 | xargs kill -9
  ```

### Frontend Issues

**Issue: `npm ERR! code ENOENT`**
- **Solution:** Ensure you're in the `ap2-frontend` directory and run `npm install`

**Issue: Port 5173 already in use**
- **Solution:** Vite will automatically try the next available port (5174, 5175, etc.)

**Issue: Backend connection failed**
- **Solution:** Ensure the backend is running on `http://localhost:8000`
- Check browser console for CORS errors

## Next Steps

- **[User Guide](./USER_GUIDE.md)** - Learn how to use the application
- **[Frontend Documentation](./FRONTEND.md)** - Understand the React architecture
- **[Backend Documentation](./BACKEND.md)** - Explore the agent system
- **[API Reference](./API_REFERENCE.md)** - API endpoint details

## Development Mode

For active development with hot reload:

**Backend (auto-reload):**
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (auto-reload):**
```bash
npm run dev
```

Both will automatically reload when you make code changes.

## Building for Production

### Frontend Build

```bash
cd ap2-frontend
npm run build
```

The production build will be in the `dist/` directory.

### Backend Deployment

For production deployment, use a production ASGI server:

```bash
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

**Congratulations!** You've successfully set up the AP2 Commerce Demo. 🎉
