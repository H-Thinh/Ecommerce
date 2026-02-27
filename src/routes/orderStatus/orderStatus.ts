import { Router } from "express";
import orderStatusController from "../../controller/orderStatusController";

const router = Router();

// OrderStatus CRUD routes
router.post("/", orderStatusController.createOrderStatus);

router.get("/", orderStatusController.getAllOrderStatuses);

router.get("/:id", orderStatusController.getOrderStatusById);

router.put("/:id", orderStatusController.updateOrderStatusById);

router.delete("/:id", orderStatusController.deleteOrderStatusById);

export default router;
