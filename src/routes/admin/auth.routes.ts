import { Router } from "express";
import authController from "../../controllers/authController";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.post("/login", authController.loginAccount);

router.post("/logout", authController.logout);

router.get("/me", verifyToken, authController.getInfoAccount);

export default router;
