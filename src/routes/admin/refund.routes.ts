import { Router } from "express";
import refundController from "../../controllers/refundController";
import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";
import { uploadImageOrderRefund } from "../../middlewares/upload";

const router = Router();

router.put(
  "/:id/VNPAY",
  verifyToken,
  checkRole(["admin"]),
  //   refundController.updateRefundByVNPAY,
);

router.put(
  "/:id/",
  verifyToken,
  checkRole(["admin"]),
  uploadImageOrderRefund.single("imageRefund"),
  refundController.processManualRefund,
);

export default router;
