import { Router } from "express";

import authController from "../../controllers/authController";

import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.post("/login", authController.loginUser);

router.post("/logout", authController.logout);

router.get("/me", verifyToken, authController.getInfoUser);

export default router;
