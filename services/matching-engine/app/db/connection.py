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
        - DB_HOST
        - DB_PORT
        - DB_NAME
        - DB_USER
        - DB_PASSWORD

    Returns:
        None — TODO: implement actual connection logic.
    """
    # TODO: build and return a psycopg2 connection using env vars.
    return None


async def initialize_database() -> None:
    """Run any one-time database setup (migrations, table creation, etc.).

    TODO: implement database initialisation logic.
    """
    pass
