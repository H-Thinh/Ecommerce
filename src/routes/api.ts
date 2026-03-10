import express from "express";

import publicRoutes from "./public/index";
import adminRoutes from "./admin/index";

const router = express.Router();

router.use("/admin", adminRoutes);

router.use("/", publicRoutes);

export default router;
