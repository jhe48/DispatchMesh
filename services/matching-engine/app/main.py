"""
Matching Engine — FastAPI application entry point.

Provides the HTTP layer for the rider-driver matching microservice.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
import uvicorn
from typing import Optional

from app.db.connection import ( get_connection, initialize_database, close_connection )
from app.services.broker import get_redis_client
from app.services.dispatch_engine import ( DispatchEngine )
from app.models.schemas import ( RideType, TripStatus, LocationUpdate, MatchRequest, TripState )

# ──────────────────────────────────────────────
# Lifespan (startup / shutdown)
# ──────────────────────────────────────────────

async def _on_startup() -> None:
    """Initialise external connections (DB, Redis, caches).

    TODO: implement actual startup logic.
    """
    get_connection()
    await initialize_database()
    get_redis_client()


async def _on_shutdown() -> None:
    """Gracefully tear down connections.

    TODO: implement actual shutdown logic.
    """
    close_connection()


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

_dispatch_engine = DispatchEngine()

@app.get("/trip/active/{rider_id}")
async def existing_ride_check(rider_id: str):
    trip_found = await _dispatch_engine.trip_exists(rider_id)
    if not trip_found:
        raise HTTPException(status_code=404, detail="No Trips Found...")
    return { "trip": trip_found }

@app.post("/match")
async def match_request_check(request: MatchRequest) -> Optional[dict]:
    match_found = await _dispatch_engine.find_match(request)
    if not match_found:
        raise HTTPException(status_code=404, detail="No Drivers Found...")
    return { "driver": match_found.driver_id }

@app.put("/location")
async def driver_location_check(update: LocationUpdate):
    await _dispatch_engine.update_driver_location(update)
    return { "status": "updated" }

@app.put("/trip/{trip_id}/cancel")
async def cancel_trip_check(trip_id: str):
    await _dispatch_engine.cancel_trip(trip_id)
    return { "status": "cancelled" }

# ──────────────────────────────────────────────
# Entrypoint
# ──────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
