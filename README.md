# Ameotech Website — React + FastAPI

This bundle contains:

- `frontend/` — React + Vite + Tailwind CSS site (TypeScript, .tsx components)
- `backend/` — FastAPI backend with a rules-based chat assistant (no LLM)

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

The site will be available at http://localhost:5173

## Running the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend will be available at http://localhost:8000

The frontend chat widget expects the backend at `http://localhost:8000`.  
You can change this by setting `VITE_API_BASE` in a `.env` file inside `frontend/`.
