"""
Database connection helpers for the matching-engine.

Reads connection parameters from environment variables and
provides a factory for obtaining database connections.
"""

import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()

# Module-level variable for Singleton Pattern
_connection = None

def get_connection():
    """Create and return a psycopg2 database connection.

    Reads the following environment variables:
        - POSTGRES_USER=dispatch_user
        - POSTGRES_PASSWORD=dispatch_pass
        - POSTGRES_DB=dispatch_mesh
        - POSTGRES_HOST=postgres
        - POSTGRES_PORT=5432
    Returns:
        Connection — To execute queries, commit executions, etc. through Database Connection.
    """

    global _connection
    if not _connection:
        try:
            postgres_connection = psycopg2.connect(
                host=os.getenv("POSTGRES_HOST"),
                port=os.getenv("POSTGRES_PORT"),
                dbname=os.getenv("POSTGRES_DB"),
                user=os.getenv("POSTGRES_USER"),
                password=os.getenv("POSTGRES_PASSWORD")
            )
            postgres_connection.autocommit = True
            _connection = postgres_connection
            return _connection
        except psycopg2.OperationalError as e:
            print(f"Operational Error Occurred: {e}")
        except psycopg2.Error as e:
            print(f"Generic Database Error: {e}")
        except Exception as e:
            print(f"Unexpected Non-Databse Error Occurred: {e}")
    else:
        return _connection


def close_connection():
    """Closes psycopg2 database connection.
    """
    global _connection
    _connection.close()
    _connection = None


async def initialize_database() -> None:
    """Run any one-time database setup (migrations, table creation, etc.).

    TODO: implement database initialisation logic.
    """
    create_drivers_table = ('''
        CREATE TABLE IF NOT EXISTS Drivers (
            driver_id SERIAL PRIMARY KEY,
            geom GEOMETRY(Point, 4326),
            heading FLOAT DEFAULT NULL, 
            speed FLOAT DEFAULT NULL,
            status VARCHAR(100),
            timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')
    drivers_gist_index = ('''
        CREATE INDEX IF NOT EXISTS idx_drivers_location
        ON Drivers USING GIST (geom);
    ''')
    create_trips_table = ('''
        CREATE TABLE IF NOT EXISTS Trips (
            trip_id SERIAL PRIMARY KEY,
            rider_id VARCHAR(255),
            driver_id VARCHAR(255),
            status VARCHAR(100),
            pickup_location GEOMETRY(Point, 4326),
            dropoff_location GEOMETRY(Point, 4326),
            ride_type VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    ''')
    global _connection
    if _connection:
        cur = _connection.cursor()
        try:
            cur.execute(create_drivers_table)    
            cur.execute(drivers_gist_index)
            cur.execute(create_trips_table)    
        except Exception as e:
            print(f"Cannot Execute SQL: {e}")
        finally: 
            if "cur" in locals():
                cur.close()
    else:
        print("Database Connection NOT Established...")