import { Router } from "express";
import paymentMethodController from "../../controller/paymentMethodController";

const router = Router();

// PaymentMethod CRUD routes
router.post("/", paymentMethodController.createPaymentMethod);

router.get("/", paymentMethodController.getAllPaymentMethods);

router.get("/active", paymentMethodController.getActivePaymentMethods);

router.get("/:id", paymentMethodController.getPaymentMethodById);

router.patch("/:id/toggle", paymentMethodController.toggleActivePaymentMethod);

router.put("/:id", paymentMethodController.updatePaymentMethodById);

router.delete("/:id", paymentMethodController.deletePaymentMethodById);

export default router;
