import { Router } from "express";
import paymentController from "../../controllers/paymentController";
import { orderLimiter } from "../../config/rateLimiter.config";

const router = Router();

router.get("/payment-resultVNPAY", paymentController.resultVnPay);

router.post("/vnpay", orderLimiter, paymentController.createVNPayUrl);

router.post("/cod", orderLimiter, paymentController.createPayment);

export default router;
