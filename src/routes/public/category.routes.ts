import { Router } from "express";
import categoryController from "../../controllers/categoryController";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.get("/", verifyToken, categoryController.getCategories);


router.get("/:slug/products", categoryController.getProductBySlugCategory);

router.get("/:categoryId", categoryController.getCategoryById);

export default router;
