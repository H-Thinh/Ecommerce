import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import categoryController from "../../controllers/categoryController";
import { uploadCoverCategory } from "../../middlewares/upload";

const router = Router();

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
