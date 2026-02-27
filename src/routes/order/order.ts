import express from "express";
import orderController from "../../controller/orderController";
import { checkRole } from "../../middlewares/checkRole";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.get("/my-orders", verifyToken, orderController.getMyOrders);

router.get("/:id", verifyToken, orderController.getOrderById);

router.get("/", checkRole(["admin"]), orderController.getAllOrders);

router.post("/", verifyToken, orderController.createOrder);

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
