import { Router } from "express";

import categoryController from "../../controllers/categoryController";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";
import { uploadCoverCategory } from "../../middlewares/upload";

const router = Router();

router.get("/top-selling", categoryController.getTopSellingCategories);

router.get("/", verifyToken, categoryController.getCategories);

router.get("/:categoryId", verifyToken, categoryController.getCategoryById);

router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  uploadCoverCategory.single("imageCategory"),
  categoryController.createCategory,
);

router.put(
  "/:categoryId",
  verifyToken,
  checkRole(["admin"]),
  uploadCoverCategory.single("imageCategory"),
  categoryController.updateCategoryById,
);

router.delete(
  "/:categoryId",
  verifyToken,
  checkRole(["admin"]),
  categoryController.deleteCategoryById,
);

export default router;
