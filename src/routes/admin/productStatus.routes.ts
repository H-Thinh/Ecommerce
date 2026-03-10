import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";

import productStatusController from "../../controllers/productStatusController";

const router = Router();

router.get("/", verifyToken, productStatusController.getAllProductStatuses);

router.get("/:id", verifyToken, productStatusController.getProductStatusById);

router.post("/", verifyToken, productStatusController.createProductStatus);

router.put(
  "/:id",
  verifyToken,
  productStatusController.updateProductStatusById,
);

router.delete(
  "/:id",
  verifyToken,
  productStatusController.deleteProductStatusById,
);

export default router;
