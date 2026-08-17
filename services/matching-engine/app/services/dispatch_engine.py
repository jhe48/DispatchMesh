"""
DispatchEngine — core matching service.

Houses the rider-driver matching, driver location tracking,
and trip cancellation logic.  All method bodies are intentionally
left empty for downstream implementation.
"""

from typing import Optional
from datetime import ( datetime, timezone )
from app.models.schemas import ( RideType, TripStatus, LocationUpdate, MatchRequest, TripState )
from app.db.connection import ( get_connection )
from app.services.broker import publish_event

import uuid

class DispatchEngine:
    """Orchestrates rider-driver matching and trip lifecycle events."""

    async def find_match(self, new_match_request: MatchRequest) -> Optional[TripState]:
        """Locate the best available driver for the given rider.

        Args:
            new_match_request: contract for a rider requesting a match.

        """
        print(f"Rider {new_match_request.rider_id} is Requesting a Driver!")

        trip_instance = TripState(
            trip_id = str(uuid.uuid4()),
            rider_id = new_match_request.rider_id,
            status = TripStatus.PENDING,
            pickup_latitude = new_match_request.pickup_latitude,
            pickup_longitude = new_match_request.pickup_longitude,
            dropoff_latitude = new_match_request.dropoff_latitude,
            dropoff_longitude = new_match_request.dropoff_longitude,
            ride_type = new_match_request.ride_type,
            created_at = new_match_request.requested_at,
        )
        conn = get_connection()
        cur = conn.cursor()
        query_driver_status_pending = 'pending'
        query_driver_status_matched = 'matched'
        
        try: 
            cur.execute("""
                SELECT driver_id 
                FROM Drivers 
                WHERE status = %s 
                ORDER BY ST_Distance(geom, ST_SetSRID(ST_MakePoint(%s, %s), 4326)) 
                LIMIT 1;""", 
            (query_driver_status_pending, 
            new_match_request.pickup_longitude, 
            new_match_request.pickup_latitude))
            closest_available_driver = cur.fetchone()
            if not closest_available_driver:
                print("No Drivers Available...")
                return None
            trip_instance.driver_id = closest_available_driver[0]
            trip_instance.status = TripStatus.MATCHED
            trip_instance.updated_at = datetime.now(timezone.utc)
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
            await publish_event("trip.matched", trip_instance.model_dump())
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
                (update.longitude, 
                update.latitude, 
                update.heading, 
                update.speed, 
                update.timestamp, 
                update.driver_id))
            print(f"Driver {update.driver_id}'s Location is Updated!")
            cur.execute("""
                SELECT rider_id
                FROM Trips
                WHERE driver_id = %s AND status IN ( 'matched', 'en_route', 'arrived', 'in_progress' )
                LIMIT 1;""",
                (update.driver_id,))
            matched_rider = cur.fetchone()
            if not matched_rider:
                print(f"No Rider Assigned to Driver {update.driver_id}...")
                return None
            payload_to_publish = {
                "rider_id": matched_rider[0],
                "latitude": update.latitude,
                "longitude": update.longitude }
            await publish_event("driver.location.updated", payload_to_publish)
        except Exception as e:
            print(f"Database Error during Matching: {e}")
        finally:
            if 'cur' in locals():
                cur.close()

    async def cancel_trip(self, trip_id: str) -> None:
        """Cancel an active trip and release the assigned driver.

        Args:
            trip_id: Unique identifier of the trip to cancel.

        """
        conn = get_connection()
        cur = conn.cursor()
        query_driver_status_pending = 'pending'
        query_driver_status_en_route = 'en_route'
        query_driver_status_matched = 'matched'
        query_driver_status_cancelled = 'cancelled'
        allowed_cancellation_status = [query_driver_status_pending, query_driver_status_en_route, query_driver_status_matched]
        try:
            cur.execute("""
                SELECT driver_id, status 
                FROM Trips
                WHERE trip_id = %s             
                LIMIT 1;""", 
                (trip_id,)) 
            driver_found = cur.fetchone()
            if not driver_found or not driver_found[0]:
                print("Driver Does Not Exists!")
                return
            # ONCE ARRIVED RIDER CANNOT CANCEL! 
            if driver_found[1] and driver_found[1] not in allowed_cancellation_status:
                print("Trip Cannot Be Cancelled!")
                return
            cur.execute("""
                UPDATE Trips
                SET status = %s, updated_at = %s
                WHERE trip_id = %s;""",
            (query_driver_status_cancelled, datetime.now(timezone.utc), trip_id))
            cur.execute("""
                UPDATE Drivers
                SET status = %s, timestamp = %s
                WHERE driver_id = %s;""",
                (query_driver_status_pending, datetime.now(timezone.utc), driver_found[0]))
            await publish_event( "trip.cancelled", {"trip_id": trip_id, "status": query_driver_status_cancelled} )
        except Exception as e:
            print(f"Database Error during Matching: {e}")
            return None
        finally:
            if 'cur' in locals():
                cur.close()