import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

/** Dedicated Redis client for publishing events.
export const publisher = new Redis(redisUrl);
 */
/** Dedicated Redis client for subscribing to channels. */
export const subscriber = new Redis(redisUrl);

/**
 * Publish a JSON-serialisable payload to a Redis channel.

export async function publishEvent(channel: string, payload: string): Promise<void> {
  // TODO: implement event publishing
  publisher.publish(channel, payload);

}
 */
/**
 * Subscribe to a Redis channel and invoke `handler` for every message.
 */
export async function subscribeToChannel(
  channel: string,
  handler: (message: string) => void,
): Promise<void> {
  // TODO: implement channel subscription
  await subscriber.subscribe(channel);
  subscriber.on('message', (receivedChannel, message) => {
    if (receivedChannel == channel) {
      handler(message);
    }
  });
}