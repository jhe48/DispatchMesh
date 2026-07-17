export interface LocationUpdate {
  driverId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  timestamp: Date;
}

export interface MatchRequest {
  riderId: string;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  rideType: 'standard' | 'premium' | 'shared';
  timestamp: Date;
}

export type TripStatus =
  | 'pending'
  | 'matched'
  | 'driver_en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface TripState {
  tripId: string;
  riderId: string;
  driverId: string | null;
  status: TripStatus;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffLatitude: number;
  dropoffLongitude: number;
  estimatedArrivalMinutes: number | null;
  fare: number | null;
  createdAt: Date;
  updatedAt: Date;
}
