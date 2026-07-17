"""
DispatchEngine — core matching service.

Houses the rider-driver matching, driver location tracking,
and trip cancellation logic.  All method bodies are intentionally
left empty for downstream implementation.
"""

from app.models.schemas import LocationUpdate


class DispatchEngine:
    """Orchestrates rider-driver matching and trip lifecycle events."""

    async def find_match(self, rider_id: str) -> None:
        """Locate the best available driver for the given rider.

        Args:
            rider_id: Unique identifier of the rider requesting a match.

        Raises:
            NotImplementedError: Method not yet implemented.
        """
        raise NotImplementedError

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
