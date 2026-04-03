import { Router } from "express";

import paymentController from "../../controllers/paymentController";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";

const router = Router();

router.get("/revenue", verifyToken, paymentController.getRevenue);

router.patch(
  "/:id/cod-confirm/:adminId",
  verifyToken,
  checkRole(["admin"]),
  paymentController.confirmCodPaymentReceived,
);

export default router;
