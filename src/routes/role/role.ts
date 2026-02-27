import express from "express";
import roleController from "../../controller/roleController";
import { checkRole } from "../../middlewares/checkRole";

const router = express.Router();

router.post("/", roleController.createRole);

router.put(
  "/:roleId",
  // verifyToken,
  // checkRole(["admin"]),
  roleController.updateRoleById
);

router.delete(
  "/:roleId",
  // verifyToken,
  // checkRole(["admin"]),
  roleController.deleteRoleById
);

router.get("/", roleController.getRoles);

router.get("/:roleId", roleController.getRoleById);

export default router;
