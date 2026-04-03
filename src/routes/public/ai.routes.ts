import express from "express";

import { aiSearch } from "../../controllers/ai.controller";

import verifyToken from "../../middlewares/verifyToken";

const router = express.Router();

router.post("/search", verifyToken, aiSearch);

export default router;
