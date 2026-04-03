import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";
import userBankAccountController from "../../controllers/userBankAccountController";

const router = Router();

router.post("/", verifyToken, userBankAccountController.createUserBankAccount);

router.patch(
  "/:id",
  verifyToken,
  userBankAccountController.togglePrimaryUserbankAccount,
);

router.get("/", verifyToken, userBankAccountController.getAllUserBankAccount);

export default router;
