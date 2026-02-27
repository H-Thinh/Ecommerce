import express from "express";
import genderController from "../../controller/genderController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.get("/", verifyToken, genderController.getGenders);

router.get("/:slug/categories", genderController.getCategoriesBySlugGender);

router.post("/", verifyToken, genderController.createGender);

router.put("/:genderId", verifyToken, genderController.updateGenderById);

router.delete("/:genderId", verifyToken, genderController.deleteGenderById);

export default router;
