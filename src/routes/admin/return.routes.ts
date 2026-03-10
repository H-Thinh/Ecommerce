import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";
import { checkRole } from "../../middlewares/checkRole";
import returnController from "../../controllers/returnController";

const router = Router();

router.put(
  "/:returnId/",
  verifyToken,
  checkRole(["admin"]),
  returnController.approveReturnByAdminId,
);

export default router;
