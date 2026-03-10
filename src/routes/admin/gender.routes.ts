import { Router } from "express";

import genderController from "../../controllers/genderController";

import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.get("/", verifyToken, genderController.getGenders);

router.post("/", verifyToken, genderController.createGender);

router.put("/:genderId", verifyToken, genderController.updateGenderById);

router.delete("/:genderId", verifyToken, genderController.deleteGenderById);

export default router;
