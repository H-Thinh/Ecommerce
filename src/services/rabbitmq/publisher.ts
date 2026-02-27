import { getChannel } from "./connection";

export function publish(queue: string, payload: any) {
  const channel = getChannel();
  channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
}
