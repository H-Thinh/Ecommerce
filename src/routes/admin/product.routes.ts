import { Router } from "express";

import productController from "../../controllers/productController";

import verifyToken from "../../middlewares/verifyToken";
import {
  uploadProductCovers,
  uploadVarianttCover,
} from "../../middlewares/upload";
import { checkRole } from "../../middlewares/checkRole";

const router = Router();

router.get("/search", verifyToken, productController.searchProduct);

router.get("/", verifyToken, productController.getAllProducts);

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
