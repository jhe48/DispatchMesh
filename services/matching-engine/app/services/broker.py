"""
Redis message broker helpers for the matching-engine.

Provides a Redis client factory and pub/sub helpers used
to broadcast and consume domain events across services.
"""

import os
import redis
from dotenv import load_dotenv
import json

load_dotenv()

# Module-level variable for Singleton Pattern for REDIS Client
_client = None

def get_redis_client():
    """Create and return a Redis client instance.

    Reads the following environment variables:
        - REDIS_HOST
        - REDIS_PORT
        - REDIS_PASSWORD  (optional)

    Returns:
        Client — actual Redis client.
    """
    # TODO: build and return a redis.Redis client using env vars.
    global _client
    if not _client:
        try:
            new_client = redis.Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), password=os.getenv("REDIS_PASSWORD"))
            _client = new_client
            return _client
        except Exception as e:
            print(f"Cannot Create Redis Client: {e}")
    else: 
        return _client


async def publish_event(channel: str, payload: dict) -> None:
    """Publish a JSON event to the specified Redis channel.

    Args:
        channel: The Redis pub/sub channel name.
        payload: Dictionary payload to serialise and publish.

    """
    client = get_redis_client()
    payload_json = json.dumps(payload)
    client.publish(channel, payload_json)


'''
TODO: This client is being used as a publisher not a subscriber.
async def subscribe_to_channel(channel: str) -> None:
    """Subscribe to a Redis channel and process incoming messages.

    Args:
        channel: The Redis pub/sub channel name to subscribe to.

    Raises:
        NotImplementedError: Method not yet implemented.
    """
    raise NotImplementedError
'''