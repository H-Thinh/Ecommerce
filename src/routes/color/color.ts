import express from "express";
import colorController from "../../controller/colorController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.get("/", colorController.getColors);

router.post("/", verifyToken, colorController.createColor);

router.put("/:colorId", verifyToken, colorController.updateColorById);

router.delete("/:colorId", verifyToken, colorController.deleteColorById);

export default router;
