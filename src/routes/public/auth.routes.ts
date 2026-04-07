import { Router } from "express";
import authController from "../../controllers/authController";
import verifyToken from "../../middlewares/verifyToken";
import { authLimiter, verifyEmailLimiter } from "../../config/rateLimiter.config";

const router = Router();

router.post("/login", authLimiter, authController.loginUser);

router.post("/logout", authController.logout);

router.get("/me", verifyToken, authController.getInfoUser);

router.get("/verify-email", verifyEmailLimiter, authController.verifyEmail);

export default router;
