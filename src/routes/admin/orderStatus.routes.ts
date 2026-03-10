import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";

import orderStatusController from "../../controllers/orderStatusController";

const router = Router();

router.post("/", verifyToken, orderStatusController.createOrderStatus);

router.get("/", verifyToken, orderStatusController.getAllOrderStatuses);

router.get("/:id", verifyToken, orderStatusController.getOrderStatusById);

router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  orderStatusController.updateOrderStatusById,
);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  orderStatusController.deleteOrderStatusById,
);

export default router;
