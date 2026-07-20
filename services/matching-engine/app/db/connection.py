"""
Database connection helpers for the matching-engine.

Reads connection parameters from environment variables and
provides a factory for obtaining database connections.
"""

import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()


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

    # TODO: build and return a psycopg2 connection using env vars.
    postgres_connection = psycopg2.connect(
        host=os.getenv("POSTGRES_HOST"),
        port=os.getenv("POSTGRES_PORT"),
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD")
    )
    return postgres_connection

async def initialize_database() -> None:
    """Run any one-time database setup (migrations, table creation, etc.).

    TODO: implement database initialisation logic.
    """
    create_driver_table = ('''
    CREATE TABLE IF NOT EXISTS drivers (
        driver_id SERIAL PRIMARY KEY,
        geom GEOMETRY(Point, 4326),
        heading FLOAT DEFAULT NULL, 
        speed FLOAT DEFAULT NULL,
        status VARCHAR(100),
        timeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')
    gist_index = ('''
        CREATE INDEX idx_drivers_location
        ON drivers USING GIST (geom);
    ''')
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(create_driver_table)
    cur.execute(gist_index)
    conn.commit()