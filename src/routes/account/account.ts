import express from "express";

import accountController from "../../controller/accountController";

import { uploadAvatar } from "../../middlewares/upload";
import { verifyToken } from "../../middlewares/verifyToken";
import adminController from "../../controller/adminController";
import { checkRole } from "../../middlewares/checkRole";

const router = express.Router();

router.get("/list", adminController.getAccounts);

router.put(
  "/update",
  verifyToken,
  uploadAvatar.single("avatar"),
  adminController.updateAccountById
);

export default router;
