import Redis from 'ioredis';

const redisUrl = `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

export const subscriber = new Redis(redisUrl);

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