from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat_routes import router as chat_router
from app.routes.rmbg_routes import router as rmbg_router

app = FastAPI(title="Model API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",
        "http://localhost:3000",
    ],  # replace with your frontend/backend origins in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(rmbg_router, prefix="/rmbg", tags=["remover"])


@app.get("/")
def root():
    return {"message": "Model API running"}
