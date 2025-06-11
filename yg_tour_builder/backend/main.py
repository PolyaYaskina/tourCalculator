from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from yg_tour_builder.backend.api.routes import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,  # 👈 ОБЯЗАТЕЛЕН, если fetch использует cookies или auth headers
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
