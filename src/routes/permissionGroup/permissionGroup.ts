import { Router } from "express";
import permissionGroupController from "../../controller/permissionGroupController";

const router = Router();

router.post("/", permissionGroupController.createPermissionGroup);

router.get("/", permissionGroupController.getPermissionGroups);

router.get("/:id", permissionGroupController.getPermissionGroupById);

router.put("/:id", permissionGroupController.updatePermissionGroupById);

router.delete("/:id", permissionGroupController.deletePermissionGroupById);

export default router;
