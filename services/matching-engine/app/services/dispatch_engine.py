"""
DispatchEngine — core matching service.

Houses the rider-driver matching, driver location tracking,
and trip cancellation logic.  All method bodies are intentionally
left empty for downstream implementation.
"""

from typing import Optional
from datetime import datetime
from app.models.schemas import ( RideType, TripStatus, LocationUpdate, MatchRequest, TripState )
from app.db.connection import ( get_connection, close_connection )


class DispatchEngine:
    """Orchestrates rider-driver matching and trip lifecycle events."""

    async def find_match(self, new_match_request: MatchRequest) -> Optional[TripState]:
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
        conn = get_connection()
        cur = conn.cursor()
        query_driver_status_pending = 'PENDING'
        query_driver_status_matched = 'MATCHED'

        cur.execute("""
            SELECT driver_id 
            FROM drivers 
            WHERE status = %s 
            ORDER BY ST_Distance(geom, ST_SetSRID(ST_MakePoint(%s, %s), 4326)) 
            LIMIT 1;""", 
            (query_driver_status_pending, 
            new_match_request.pickup_longitude, 
            new_match_request.pickup_latitude))
        
        try: 
            closest_available_driver = cur.fetchone()
            if not closest_available_driver:
                print("No Drivers Available...")
                return None
            trip_instance.driver_id = closest_available_driver[0]
            trip_instance.status = TripStatus.MATCHED
            trip_instance.updated_at = datetime.utcnow()
            cur.execute("""
                UPDATE drivers 
                SET status = %s 
                WHERE driver_id = %s;""", 
                (query_driver_status_matched, 
                closest_available_driver[0]))
            return trip_instance
        except Exception as e:
            print(f"Database Error during Matching: {e}")
            return None
        finally:
            if 'cur' in locals():
                cur.close()

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
