import { Router } from "express";

import productController from "../../controllers/productController";

import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.get("/", productController.getAllProducts);

router.get("/featured", productController.getFeaturedProducts);

router.get("/sale", productController.getSaleProducts);

router.get("/:slug", productController.getProductBySlug);

router.get("/:productId", verifyToken, productController.getProductById);

export default router;
