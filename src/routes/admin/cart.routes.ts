import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";

import cartController from "../../controllers/cartController";

const router = Router();

router.get("/", verifyToken, cartController.getProductsToCart);

export default router;
