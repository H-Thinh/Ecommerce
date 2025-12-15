import express from "express";

import accountController from "../../controller/accountController";

import { uploadAvatar } from "../../middlewares/upload";
import { verifyToken } from "../../middlewares/verifyToken";
import adminController from "../../controller/adminController";
import { checkRole } from "../../middlewares/checkRole";
import roleController from "../../controller/roleController";

const router = express.Router();

//account
router.post("/add", verifyToken, adminController.createAccount);

router.delete(
  "/delete/:id",
  verifyToken,
  checkRole(["admin"]),
  adminController.deleteAccountById
);

router.put(
  "/update/:id",
  verifyToken,
  checkRole(["admin"]),
  uploadAvatar.single("avatar"),
  accountController.updateAccountById
);

//role
router.post("/add", roleController.createRole);

router.put("/update/:roleId", roleController.updateRoleById);

export default router;
