import { Router } from "express";
import genderController from "../../controllers/genderController";

const router = Router();

router.get("/:slug/categories", genderController.getCategoriesBySlugGender);

export default router;
