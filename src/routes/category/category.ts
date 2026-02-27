import express from "express";
import categoryController from "../../controller/categoryController";
import verifyToken from "../../middlewares/verifyToken";
import { uploadCoverCategory } from "../../middlewares/upload";

const router = express.Router();

router.get("/:slug/products", categoryController.getProductBySlugCategory);

router.get("/", verifyToken, categoryController.getCategorys);

router.get("/:categoryId", verifyToken, categoryController.getCategoryById);

router.post(
  "/",
  verifyToken,
  uploadCoverCategory.single("imageCategory"),
  categoryController.createCategory,
);

router.put(
  "/:categoryId",
  verifyToken,
  uploadCoverCategory.single("imageCategory"),
  categoryController.updateCategoryById,
);

// router.post("/test-no-upload", categoryController.createCategory);

router.delete(
  "/:categoryId",
  verifyToken,
  categoryController.deleteCategoryById,
);

export default router;
