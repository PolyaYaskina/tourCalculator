# Project Setup

## Backend

Use a Python virtual environment and install dependencies before starting the API server.

```bash
cd yg_tour_builder/backend
python3 -m venv venv
source venv/bin/activate
pip install -r ../../requirements.txt
uvicorn main:app --reload
```

## Frontend

Install Node.js dependencies and launch the development server.

```bash
cd yg_tour_builder/frontend
npm install
npm run dev
```
