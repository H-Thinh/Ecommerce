import express from "express";
import productController from "../../controller/productController";
import { checkRole } from "../../middlewares/checkRole";
import verifyToken from "../../middlewares/verifyToken";
import {
  uploadProductCovers,
  uploadVarianttCover,
} from "../../middlewares/upload";

const router = express.Router();

router.get("/", productController.getAllProducts);

router.get("/featured", productController.getFeaturedProducts);

router.get("/sale", productController.getSaleProducts);

router.get("/:slug", productController.getProductBySlug);

router.get("/:productId", verifyToken, productController.getProductById);

router.post(
  "/",
  verifyToken,
  // checkRole(["admin"]),
  uploadProductCovers.array("productCover"),
  productController.createProduct,
);

router.put(
  "/:productId",
  verifyToken,
  checkRole(["admin"]),
  uploadProductCovers.array("productCover"),
  productController.updateProductById,
);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  productController.deleteProductById,
);

// Product Variant routes
router.get("/:productId/variants", productController.getProductVariants);

router.post(
  "/:productId/variants",
  verifyToken,
  checkRole(["admin"]),
  uploadVarianttCover.single("variantCover"),
  productController.createProductVariant,
);

router.put(
  "/:productId/variants/:id",
  verifyToken,
  checkRole(["admin"]),
  uploadVarianttCover.single("variantCover"),
  productController.updateProductVariantById,
);

router.delete(
  "/:productId/variants/:id",
  verifyToken,
  checkRole(["admin"]),
  productController.deleteProductVariantById,
);

export default router;
