import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import sizeController from "../../controllers/sizeController";

const router = Router();

router.get("/", verifyToken, sizeController.getSizes);

export default router;
