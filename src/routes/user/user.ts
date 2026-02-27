import { Router } from "express";
import userController from "../../controller/userController";
import { uploadAvatarUser } from "../../middlewares/upload";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.post("/", userController.createUser);

router.get("/", verifyToken, userController.getUserById);

router.put(
  "/",
  verifyToken,
  uploadAvatarUser.single("avatarUser"),
  userController.updateUserById,
);

export default router;
