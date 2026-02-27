import express from "express";
import cartController from "../../controller/cartController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.get("/", verifyToken, cartController.getProductsToCart);

router.post("/", verifyToken, cartController.createCart);

router.post("/items/:variantId", verifyToken, cartController.addProductToCart);

router.delete(
  "/items/:variantId",
  verifyToken,
  cartController.removeProductToCart,
);

router.patch(
  "/items/:variantId/increase",
  verifyToken,
  cartController.increaseQuantity,
);

router.patch(
  "/items/:variantId/decrease",
  verifyToken,
  cartController.decreaseQuantity,
);

export default router;
