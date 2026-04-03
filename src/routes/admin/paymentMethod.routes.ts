import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";

import paymentMethodController from "../../controllers/paymentMethodController";

const router = Router();

router.get("/", verifyToken, paymentMethodController.getAllPaymentMethods);

router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  paymentMethodController.createPaymentMethod,
);

router.get("/:id", verifyToken, paymentMethodController.getPaymentMethodById);

router.patch(
  "/:id/toggle",
  verifyToken,
  checkRole(["admin"]),
  paymentMethodController.toggleActivePaymentMethod,
);

router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  paymentMethodController.updatePaymentMethodById,
);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  paymentMethodController.deletePaymentMethodById,
);

export default router;
