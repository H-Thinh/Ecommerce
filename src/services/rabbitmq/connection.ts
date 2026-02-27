import amqp from "amqplib";

let channel: amqp.Channel;

export async function initRabbitMQ() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL!);
  channel = await conn.createChannel();
}

export function getChannel() {
  if (!channel) throw new Error("RabbitMQ not initialized");
  return channel;
}
