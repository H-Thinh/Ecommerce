import { Router } from "express";
import pointRuleController from "../../controller/pointRuleController";
import verifyToken from "../../middlewares/verifyToken";

const router = Router();

router.get("/", verifyToken, pointRuleController.getPointRules);

router.post("/", verifyToken, pointRuleController.createPointRule);

router.get("/:id", verifyToken, pointRuleController.getPointRuleById);

router.put("/:id", verifyToken, pointRuleController.updatePointRuleById);

router.delete("/:id", verifyToken, pointRuleController.deletePointRuleById);

router.patch(
  "/:id/toggle",
  verifyToken,
  pointRuleController.toggleActivePointRule,
);

export default router;
