"""
Pydantic schemas for the matching-engine microservice.

These models mirror the TypeScript contracts used across the
DispatchMesh platform, translated to idiomatic Python (snake_case,
Optional types, datetime).
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ──────────────────────────────────────────────
# Enums
# ──────────────────────────────────────────────

class RideType(str, Enum):
    """Type of ride requested by the rider."""
    STANDARD = "standard"
    PREMIUM = "premium"
    SHARED = "shared"


class TripStatus(str, Enum):
    """Current status of a trip throughout its lifecycle."""
    PENDING = "pending"
    MATCHED = "matched"
    EN_ROUTE = "en_route"
    ARRIVED = "arrived"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# ──────────────────────────────────────────────
# Schemas
# ──────────────────────────────────────────────

class LocationUpdate(BaseModel):
    """Real-time GPS update from a driver."""
    driver_id: str
    latitude: float
    longitude: float
    heading: Optional[float] = None
    speed: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class MatchRequest(BaseModel):
    """Incoming ride-match request from a rider."""
    rider_id: str
    pickup_latitude: float
    pickup_longitude: float
    dropoff_latitude: float
    dropoff_longitude: float
    ride_type: RideType = RideType.STANDARD
    requested_at: datetime = Field(default_factory=datetime.utcnow)


class TripState(BaseModel):
    """Snapshot of a trip's current state."""
    trip_id: str
    rider_id: str
    driver_id: Optional[str] = None
    status: TripStatus = TripStatus.PENDING
    pickup_latitude: float
    pickup_longitude: float
    dropoff_latitude: float
    dropoff_longitude: float
    ride_type: RideType = RideType.STANDARD
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
