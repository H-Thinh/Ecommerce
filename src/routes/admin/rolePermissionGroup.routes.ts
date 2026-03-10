import express from "express";
import rolePermissionGroupController from "../../controllers/rolePermissionGroupController";
import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  rolePermissionGroupController.assignPermissionGroupToRole,
);

router.get(
  "/",
  verifyToken,
  rolePermissionGroupController.getAllRolesWithPermissionGroups,
);

router.get(
  "/role/:roleId",
  verifyToken,
  rolePermissionGroupController.getRolePermissionGroups,
);

router.put(
  "/:roleId/:permissionGroupId",
  verifyToken,
  rolePermissionGroupController.updateRolePermissionGroup,
);

router.delete(
  "/:roleId/:permissionGroupId",
  verifyToken,
  rolePermissionGroupController.removePermissionGroupFromRole,
);

export default router;
