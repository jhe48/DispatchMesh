import { LocationUpdate, MatchRequest } from '../types/contracts.js';

/**
 * Core dispatch engine responsible for rider-driver matching,
 * driver location tracking, and trip lifecycle management.
 */
export class DispatchEngine {
  /**
   * Find and assign the best available driver for the given rider.
   */
  async findMatch(match_request: MatchRequest): Promise<void> {
        const find_match_response = await fetch(`http://matching-engine:8000/match`, {
        method: `POST`,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(match_request)
        });
      if (!find_match_response.ok) {
        throw new Error(`Python backend failed with status: ${find_match_response.status}`); 
      }
  }

  /**
   * Persist a real-time location update from a driver.
   */
  async updateDriverLocation(location_update: LocationUpdate): Promise<void> {
      const update_driver_response = await fetch(`http://matching-engine:8000/location`, {
        method: `PUT`,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location_update)
      });
      if (!update_driver_response.ok) {
        throw new Error(`Python backend failed with status: ${update_driver_response.status}`); 
      }
  }

  /**
   * Cancel an in-progress or pending trip.
   */
  async cancelTrip(tripId: string): Promise<void> {
      const cancel_trip_response = await fetch(`http://matching-engine:8000/trip/${tripId}/cancel`, {
        method: `PUT`,
        headers: { 'Content-Type': 'application/json' },
        body: tripId
      });
      if (!cancel_trip_response.ok) {
        throw new Error(`Python backend failed with status: ${cancel_trip_response.status}`); 
      }
  }
}