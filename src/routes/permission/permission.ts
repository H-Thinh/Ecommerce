import express from "express";

import { checkRole } from "../../middlewares/checkRole";

import permissionController from "../../controller/permissionController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.post(
  "/",
  // verifyToken,
  // checkRole(["admin"]),
  permissionController.createPermission
);

router.put(
  "/:permissionId",
  verifyToken,
  checkRole(["admin"]),
  permissionController.updatePermissionById
);

router.delete(
  "/:permissionId",
  verifyToken,
  checkRole(["admin"]),
  permissionController.deletePermissionById
);

router.get(
  "/",
  // verifyToken,
  // checkRole(["admin"]),
  permissionController.getPermissions
);

router.get(
  "/:permissionId",
  // verifyToken,
  // checkRole(["admin"]),
  permissionController.getPermissionById
);

export default router;
