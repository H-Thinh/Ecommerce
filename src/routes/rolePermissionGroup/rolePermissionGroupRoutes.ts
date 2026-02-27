import express from "express";
import rolePermissionGroupController from "../../controller/rolePermissionGroupController";

const router = express.Router();

router.post("/", rolePermissionGroupController.assignPermissionGroupToRole);

router.get("/", rolePermissionGroupController.getAllRolesWithPermissionGroups);

router.get(
  "/role/:roleId",
  rolePermissionGroupController.getRolePermissionGroups
);

router.put(
  "/:roleId/:permissionGroupId",
  rolePermissionGroupController.updateRolePermissionGroup
);

router.delete(
  "/:roleId/:permissionGroupId",
  rolePermissionGroupController.removePermissionGroupFromRole
);

export default router;
