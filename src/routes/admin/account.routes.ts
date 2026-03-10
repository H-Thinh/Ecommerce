import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";
import { uploadAvatarAccount } from "../../middlewares/upload";

import accountController from "../../controllers/accountController";

const router = Router();

router.put(
  "/",
  verifyToken,
  uploadAvatarAccount.single("avatarAccount"),
  accountController.updateAccountById,
);

router.get("/", verifyToken, accountController.getAccountById);

export default router;
