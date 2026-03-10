import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";

import paymentMethodController from "../../controllers/paymentMethodController";

const router = Router();

router.get("/", verifyToken, paymentMethodController.getAllPaymentMethods);

router.get(
  "/active",
  verifyToken,
  paymentMethodController.getActivePaymentMethods,
);

export default router;
