import { publish } from "../publisher";
import { QUEUES } from "../queues";
import { OrderConfirmationPayload, OrderStatusUpdatePayload, VerifyEmailPayload } from "../../mail/mail.service";

export const publishOrderConfirmationEmail = (payload: OrderConfirmationPayload) => {
  publish(QUEUES.ORDER_CONFIRMATION_EMAIL, payload);
};

export const publishOrderStatusUpdateEmail = (payload: OrderStatusUpdatePayload) => {
  publish(QUEUES.ORDER_STATUS_UPDATE_EMAIL, payload);
};

export const publishVerifyEmail = (payload: VerifyEmailPayload) => {
  publish(QUEUES.VERIFY_EMAIL, payload);
};
