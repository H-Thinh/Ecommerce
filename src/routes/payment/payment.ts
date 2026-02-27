import { Router } from "express";
import paymentController from "../../controller/paymentController";

const router = Router();

router.get("/payment-resultVNPAY", paymentController.resultVnPay);

router.post("/vnpay", paymentController.createVNPayUrl);

router.post("/cod", paymentController.createPayment);

export default router;
