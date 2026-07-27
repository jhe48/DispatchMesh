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
            FROM Drivers 
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
                UPDATE Drivers 
                SET status = %s 
                WHERE driver_id = %s;""", 
                (query_driver_status_matched, 
                closest_available_driver[0]))
            cur.execute("""
                INSERT INTO Trips (trip_id, rider_id, driver_id, status, pickup_location, dropoff_location, ride_type, created_at, updated_at)
                VALUES (%s, %s, %s, %s, ST_SetSRID(ST_MakePoint(%s, %s), 4326), ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s, %s, %s);""", 
                (trip_instance.trip_id, 
                 trip_instance.rider_id, 
                 trip_instance.driver_id,
                 trip_instance.status,
                 trip_instance.pickup_longitude, trip_instance.pickup_latitude,
                 trip_instance.dropoff_longitude, trip_instance.dropoff_latitude, 
                 trip_instance.ride_type,
                 trip_instance.created_at,
                 trip_instance.updated_at))
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

        """
        print(f"Updating Driver {update.driver_id}'s Location...")
        conn = get_connection()
        cur = conn.cursor()
        try: 
            cur.execute("""
                UPDATE Drivers
                SET geom = ST_SetSRID(ST_MakePoint(%s, %s), 4326), heading = %s, speed = %s, timestamp = %s
                WHERE driver_id = %s;""",
                (update.longitude, update.latitude, update.heading, update.speed, update.timestamp, update.driver_id))
            print(f"Driver {update.driver_id}'s Location is Updated!")
        except Exception as e:
            print(f"Database Error during Matching: {e}")
        finally:
            if 'cur' in locals():
                cur.close()

    async def cancel_trip(self, trip_id: str) -> None:
        """Cancel an active trip and release the assigned driver.

        Args:
            trip_id: Unique identifier of the trip to cancel.

        Raises:
            NotImplementedError: Method not yet implemented.
        """
        raise NotImplementedError
