from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from .core.config import settings
from .core.database import init_db
from .api.auth import router as auth_router
from .api.moods import router as moods_router

app = FastAPI(title="MoodMosaic", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def startup():
    await init_db()

app.include_router(auth_router)
app.include_router(moods_router)

frontend = os.environ.get("FRONTEND_PATH", "")
if frontend and os.path.exists(frontend):
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=frontend, html=True), name="frontend")

@app.get("/health")
async def health():
    return {"status": "ok", "app": "MoodMosaic"}
