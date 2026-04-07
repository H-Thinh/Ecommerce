import { Router } from "express";
import orderController from "../../controllers/orderController";
import verifyToken from "../../middlewares/verifyToken";
import { uploadImageReturnOrder } from "../../middlewares/upload";
import { orderLimiter } from "../../config/rateLimiter.config";

const router = Router();

router.post("/", verifyToken, orderLimiter, orderController.createOrder);

router.get("/my-orders", verifyToken, orderController.getMyOrders);

router.get("/:orderId", verifyToken, orderController.getOrderById);

router.patch(
  "/:orderId/confirm-received",
  verifyToken,
  orderController.confirmOrderReceived,
);

router.patch(
  "/:orderId/cancel",
  verifyToken,
  orderController.cancelOrderByUserId,
);

router.patch(
  "/:orderItemId/return",
  verifyToken,
  uploadImageReturnOrder.array("iamgesReturn"),
  orderController.returnOrderByUserId,
);

export default router;
