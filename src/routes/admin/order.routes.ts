import { Router } from "express";

import orderController from "../../controllers/orderController";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";

const router = Router();

router.get("/:orderId", verifyToken, orderController.getOrderById);

router.patch(
  "/:orderId",
  verifyToken,
  checkRole(["admin"]),
  orderController.updateOrderStatusById,
);

router.get(
  "/",
  verifyToken,
  checkRole(["admin"]),
  orderController.getAllOrders,
);

router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  orderController.createOrder,
);

router.patch(
  "/:orderId/cancel",
  verifyToken,
  checkRole(["admin"]),
  orderController.cancelOrderByAdmin,
);

router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  orderController.updateOrderById,
);
router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  orderController.deleteOrderById,
);

export default router;
