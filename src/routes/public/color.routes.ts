import { Router } from "express";

import colorController from "../../controllers/colorController";

const router = Router();

router.get("/", colorController.getColors);

export default router;
