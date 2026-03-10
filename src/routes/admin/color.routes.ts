import { Router } from "express";

import colorController from "../../controllers/colorController";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";

const router = Router();

router.get("/", verifyToken, colorController.getColors);

router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  colorController.createColor,
);

router.put(
  "/:colorId",
  verifyToken,
  checkRole(["admin"]),
  colorController.updateColorById,
);

router.delete(
  "/:colorId",
  verifyToken,
  checkRole(["admin"]),
  colorController.deleteColorById,
);

export default router;
