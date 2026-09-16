-- ============================================
-- Extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- Tables
-- ============================================
CREATE TABLE IF NOT EXISTS Drivers (
    driver_id VARCHAR(255) PRIMARY KEY,
    geom GEOMETRY(Point, 4326),
    heading FLOAT DEFAULT NULL, 
    speed FLOAT DEFAULT NULL,
    status VARCHAR(100),
    timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Trips (
    trip_id VARCHAR(255) PRIMARY KEY,
    rider_id VARCHAR(255),
    driver_id VARCHAR(255),
    status VARCHAR(100),
    pickup_location GEOMETRY(Point, 4326),
    dropoff_location GEOMETRY(Point, 4326),
    ride_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_drivers_location
    ON Drivers USING GIST (geom);

-- ============================================
-- Seed Data
-- ============================================
INSERT INTO Drivers (driver_id, geom, status)
VALUES 
    ('-1', ST_SetSRID(ST_MakePoint (-73.5590, 40.7191), 4326), 'pending'),
    ('-2', ST_SetSRID(ST_MakePoint (-73.5545, 40.7140), 4326), 'pending'),
    ('-3', ST_SetSRID(ST_MakePoint (-73.5630, 40.7105), 4326), 'pending'),
    ('-4', ST_SetSRID(ST_MakePoint (-73.5510, 40.7172), 4326), 'pending'),
    ('-5', ST_SetSRID(ST_MakePoint (-73.5570, 40.7088), 4326), 'pending')
-- ============================================
--  ('-6', ST_SetSRID(ST_MakePoint (-73.5665, 40.7155), 4326), 'pending'),
--  ('-7', ST_SetSRID(ST_MakePoint (-73.5530, 40.7210), 4326), 'en_route'),
--  ('-8', ST_SetSRID(ST_MakePoint (-73.5490, 40.7120), 4326), 'pending'),
--  ('-9', ST_SetSRID(ST_MakePoint (-73.5620, 40.7165), 4326), 'pending'),
--  ('-10', ST_SetSRID(ST_MakePoint (-73.5540, 40.7098), 4326), 'pending');
-- =============================================
