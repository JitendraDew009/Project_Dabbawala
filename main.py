from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from database import create_tables, get_session

from routes.orders import router as orders_router
from routes.stats import router as stats_router

BASE_DIR = Path(__file__).resolve().parent

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    create_tables()
    print("Database tables created.")
    yield
    print("Application shutdown.")

app = FastAPI(
    title="Dabbawala API",
    description="API for managing orders and statistics for the Dabbawala service.",
    version="1.0.0",
    lifespan=lifespan
)  

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
app.include_router(orders_router)
app.include_router(stats_router)

@app.get("/", include_in_schema=False)
def dashboard():
    return FileResponse(BASE_DIR / "static" / "index.html")

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
