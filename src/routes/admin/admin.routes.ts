import { Router } from "express";

import adminController from "../../controllers/adminController";

import { checkRole } from "../../middlewares/checkRole";

import verifyToken from "../../middlewares/verifyToken";

import {
  uploadAvatarAccount,
  uploadAvatarUser,
} from "../../middlewares/upload";

const router = Router();

router.get("/", verifyToken, adminController.getAccounts);

router.post(
  "/",
  verifyToken,
  checkRole(["admin"]),
  adminController.createAccount,
);

router.put(
  "/account/:id",
  verifyToken,
  checkRole(["admin"]),
  uploadAvatarAccount.single("avatarAccount"),
  adminController.updateAccountById,
);

router.delete(
  "/account/:id",
  verifyToken,
  checkRole(["admin"]),
  adminController.deleteAccountById,
);

//users
router.get("/users/search", verifyToken, adminController.searchUser);

router.get("/users/count", verifyToken, adminController.getTotalUsers);

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
