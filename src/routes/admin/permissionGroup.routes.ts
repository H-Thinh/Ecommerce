import { Router } from "express";
import permissionGroupController from "../../controllers/permissionGroupController";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.post("/", verifyToken, permissionGroupController.createPermissionGroup);

router.get("/", verifyToken, permissionGroupController.getPermissionGroups);

router.get(
  "/:id",
  verifyToken,
  permissionGroupController.getPermissionGroupById,
);

router.put(
  "/:id",
  verifyToken,
  permissionGroupController.updatePermissionGroupById,
);

router.delete(
  "/:id",
  verifyToken,
  permissionGroupController.deletePermissionGroupById,
);

export default router;
