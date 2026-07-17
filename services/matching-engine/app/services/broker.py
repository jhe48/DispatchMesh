"""
Redis message broker helpers for the matching-engine.

Provides a Redis client factory and pub/sub helpers used
to broadcast and consume domain events across services.
"""

import os

import redis


def get_redis_client():
    """Create and return a Redis client instance.

    Reads the following environment variables:
        - REDIS_HOST
        - REDIS_PORT
        - REDIS_PASSWORD  (optional)

    Returns:
        None — TODO: implement actual Redis client creation.
    """
    # TODO: build and return a redis.Redis client using env vars.
    return None


async def publish_event(channel: str, payload: dict) -> None:
    """Publish a JSON event to the specified Redis channel.

    Args:
        channel: The Redis pub/sub channel name.
        payload: Dictionary payload to serialise and publish.

    Raises:
        NotImplementedError: Method not yet implemented.
    """
    raise NotImplementedError


async def subscribe_to_channel(channel: str) -> None:
    """Subscribe to a Redis channel and process incoming messages.

    Args:
        channel: The Redis pub/sub channel name to subscribe to.

    Raises:
        NotImplementedError: Method not yet implemented.
    """
    raise NotImplementedError
