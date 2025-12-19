# Development Guide

## Development Environment Setup

### Prerequisites
- Node.js 18+ and Python 3.8+
- VS Code (recommended) or your preferred IDE
- Git for version control

### Initial Setup

**Backend:**
```bash
cd ap2_demo
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

**Frontend:**
```bash
cd ap2-frontend
npm install
```

## Development Workflow

### Running in Development Mode

**Backend with auto-reload:**
```bash
cd ap2_demo
uvicorn server:app --reload
```

**Frontend with HMR:**
```bash
cd ap2-frontend
npm run dev
```

### Code Structure

**Frontend Components:**
- Keep components focused and reusable
- Use TypeScript for type safety
- Follow React hooks best practices

**Backend Agents:**
- Each agent has a single responsibility
- Use type hints for all functions
- Log all agent actions

### Making Changes

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

## Testing

### Frontend Testing
```bash
npm run test
npm run type-check
```

### Backend Testing
```bash
python -m pytest
```

## Building for Production

### Frontend Build
```bash
npm run build
```

### Backend Deployment
```bash
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## Code Style

- **Frontend:** ESLint + Prettier
- **Backend:** PEP 8 + Black formatter

---

For more details, see other documentation files.
