import { getChannel } from "../connection";
import { QUEUES } from "../queues";
import { sendVerifyEmail } from "../../mail/mail.service";

const startVerifyEmailConsumer = async () => {
  const channel = getChannel();
  await channel.assertQueue(QUEUES.VERIFY_EMAIL, { durable: true });
  channel.consume(QUEUES.VERIFY_EMAIL, async (msg) => {
    if (!msg) return;
    try {
      const payload = JSON.parse(msg.content.toString());
      await sendVerifyEmail(payload);
      console.log(`✅ Sent verify email to ${payload.to}`);
      channel.ack(msg);
    } catch (error) {
      console.error("Verify email consumer error:", error);
      channel.nack(msg, false, false);
    }
  });
};

const userConsumer = {
  startVerifyEmailConsumer,
};

export default userConsumer;
