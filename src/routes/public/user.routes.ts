import { Router } from "express";
import userController from "../../controllers/userController";
import verifyToken from "../../middlewares/verifyToken";
import { uploadAvatarUser } from "../../middlewares/upload";
import { authLimiter } from "../../config/rateLimiter.config";

const router = Router();

router.post("/", authLimiter, userController.createUser);

router.get("/", verifyToken, userController.getUserById);

router.put(
  "/",
  verifyToken,
  uploadAvatarUser.single("avatarUser"),
  userController.updateUserById,
);

export default router;
