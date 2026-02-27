import express from "express";

import adminController from "../../controller/adminController";

import {
  uploadAvatarAccount,
  uploadAvatarUser,
} from "../../middlewares/upload";
import { checkRole } from "../../middlewares/checkRole";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.get("/", adminController.getAccounts);

router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  adminController.createAccount,
);

router.put(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  uploadAvatarAccount.single("avatarAccount"),
  adminController.updateAccountById,
);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin"]),
  adminController.deleteAccountById,
);

//users

router.post(
  "/users/",
  verifyToken,
  uploadAvatarUser.single("avatarUser"),
  adminController.createUser,
);

router.get("/users/", verifyToken, adminController.getAllUsers);

router.get("/users/:id", verifyToken, adminController.getUserById);

router.put(
  "/users/:id",
  verifyToken,
  uploadAvatarUser.single("avatarUser"),
  adminController.updateUserById,
);

router.delete("/users/:id", verifyToken, adminController.deleteUserById);

export default router;
