import express from "express";
import authController from "../../controller/authController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/login/account", authController.loginAccount);

router.post("/login/user", authController.loginUser);

router.post("/logout", authController.logout);

router.get("/me/account", verifyToken, authController.getInfoAccount);

router.get("/me/user", verifyToken, authController.getInfoUser);

export default router;
