"""
DispatchEngine — core matching service.

Houses the rider-driver matching, driver location tracking,
and trip cancellation logic.  All method bodies are intentionally
left empty for downstream implementation.
"""

from app.models.schemas import ( RideType, TripStatus, LocationUpdate, MatchRequest, TripState )


class DispatchEngine:
    """Orchestrates rider-driver matching and trip lifecycle events."""

    async def find_match(self, new_match_request: MatchRequest) -> TripState:
        """Locate the best available driver for the given rider.

        Args:
            new_match_request: contract for a rider requesting a match.

        """
        print(f"Rider {new_match_request.rider_id} is Requesting a Driver!")

        trip_instance = TripState(
            trip_id = new_match_request.rider_id, # Some UNIQUE TRIP ID
            rider_id = new_match_request.rider_id,
            status = TripStatus.PENDING,
            pickup_latitude = new_match_request.pickup_latitude,
            pickup_longitude = new_match_request.pickup_longitude,
            dropoff_latitude = new_match_request.dropoff_latitude,
            dropoff_longitude = new_match_request.dropoff_longitude,
            ride_type = new_match_request.ride_type,
            created_at = new_match_request.requested_at,
        )

        # Query Closest Available Driver to fill in trip_instance( driver_id = X)
        # 
        return trip_instance

    async def update_driver_location(self, update: LocationUpdate) -> None:
        """Persist a real-time GPS update from a driver.

        Args:
            update: A LocationUpdate payload containing coordinates and metadata.

        Raises:
            NotImplementedError: Method not yet implemented.
        """
        raise NotImplementedError

    async def cancel_trip(self, trip_id: str) -> None:
        """Cancel an active trip and release the assigned driver.

        Args:
            trip_id: Unique identifier of the trip to cancel.

        Raises:
            NotImplementedError: Method not yet implemented.
        """
        raise NotImplementedError
