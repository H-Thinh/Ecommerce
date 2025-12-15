import express from "express";
import auth from "./auth/auth";
import account from "./account/account";
import admin from "./admin/admin";

const router = express.Router();

router.use("/auth", auth);

router.use("/admin", admin);

router.use("/account", account);

export default router;
