import { getChannel } from "../connection";
import { QUEUES } from "../queues";
import {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendVerifyEmail,
} from "../../mail/mail.service";

const startOrderConfirmationEmailConsumer = async () => {
  const channel = getChannel();
  await channel.assertQueue(QUEUES.ORDER_CONFIRMATION_EMAIL, { durable: true });
  channel.consume(QUEUES.ORDER_CONFIRMATION_EMAIL, async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      await sendOrderConfirmationEmail(payload);
      console.log(`✅ Sent order confirmation email to ${payload.to}`);
      channel.ack(msg);
    } catch (error) {
      console.error("Order email consumer error:", error);
      channel.nack(msg, false, false);
    }
  });
};

const startOrderStatusUpdateEmailConsumer = async () => {
  const channel = getChannel();
  await channel.assertQueue(QUEUES.ORDER_STATUS_UPDATE_EMAIL, {
    durable: true,
  });
  channel.consume(QUEUES.ORDER_STATUS_UPDATE_EMAIL, async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      await sendOrderStatusUpdateEmail(payload);
      console.log(`✅ Sent order status update email to ${payload.to}`);
      channel.ack(msg);
    } catch (error) {
      console.error("Order status email consumer error:", error);
      channel.nack(msg, false, false);
    }
  });
};

const orderConsumer = {
  startOrderConfirmationEmailConsumer,
  startOrderStatusUpdateEmailConsumer,
};

export default orderConsumer;
