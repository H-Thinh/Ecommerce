import { Router } from "express";

import productController from "../../controllers/productController";

import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.get("/", productController.getAllProducts);

router.get("/featured", productController.getFeaturedProducts);

router.get("/sale", productController.getSaleProducts);

router.get("/slug/:slug", productController.getProductBySlug);

router.get("/detail/:productId", verifyToken, productController.getProductById);

router.get("/search", productController.searchProduct);

router.post(
  "/:productId/view",
  verifyToken,
  productController.createProductView,
);

export default router;
