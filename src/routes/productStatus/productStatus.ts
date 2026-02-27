import { Router } from "express";
import productStatusController from "../../controller/productStatusController";

const router = Router();

router.get("/", productStatusController.getAllProductStatuses);

router.get("/:id", productStatusController.getProductStatusById);

router.post("/", productStatusController.createProductStatus);

router.put("/:id", productStatusController.updateProductStatusById);

router.delete("/:id", productStatusController.deleteProductStatusById);

export default router;
