import { Router } from "express";

import roleController from "../../controllers/roleController";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";

const router = Router();

router.post("/", roleController.createRole);

router.put(
  "/:roleId",
  // verifyToken,
  // checkRole(["admin"]),
  roleController.updateRoleById,
);

router.delete(
  "/:roleId",
  // verifyToken,
  //   checkRole(["admin"]),
  roleController.deleteRoleById,
);

router.get("/", roleController.getRoles);

router.get("/:roleId", roleController.getRoleById);

export default router;
