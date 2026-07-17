"""
Matching Engine — FastAPI application entry point.

Provides the HTTP layer for the rider-driver matching microservice.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
import uvicorn

from app.db.connection import initialize_database
from app.services.broker import get_redis_client


# ──────────────────────────────────────────────
# Lifespan (startup / shutdown)
# ──────────────────────────────────────────────

async def _on_startup() -> None:
    """Initialise external connections (DB, Redis, caches).

    TODO: implement actual startup logic.
    """
    pass


async def _on_shutdown() -> None:
    """Gracefully tear down connections.

    TODO: implement actual shutdown logic.
    """
    pass


@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan context manager."""
    await _on_startup()
    yield
    await _on_shutdown()


# ──────────────────────────────────────────────
# Application
# ──────────────────────────────────────────────

app = FastAPI(
    title="DispatchMesh Matching Engine",
    version="0.1.0",
    lifespan=lifespan,
)


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """Liveness / readiness probe."""
    return {"status": "ok"}


# ──────────────────────────────────────────────
# Entrypoint
# ──────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
