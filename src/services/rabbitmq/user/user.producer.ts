import { publish } from "../publisher";

import { QUEUES } from "../queues";

import { VerifyEmailPayload } from "../../mail/mail.service";

export const publishVerifyEmail = (payload: VerifyEmailPayload) => {
  publish(QUEUES.VERIFY_EMAIL, payload);
};
