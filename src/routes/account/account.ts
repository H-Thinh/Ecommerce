import express from "express";

import accountController from "../../controller/accountController";

import { uploadAvatarAccount } from "../../middlewares/upload";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.put(
  "/",
  verifyToken,
  uploadAvatarAccount.single("avatarAccount"),
  accountController.updateAccountById
);

router.get("/", verifyToken, accountController.getAccountById);

export default router;
