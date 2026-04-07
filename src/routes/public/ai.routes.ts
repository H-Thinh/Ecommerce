import express from "express";
import { aiSearch } from "../../controllers/ai.controller";
import verifyToken from "../../middlewares/verifyToken";
import { aiLimiter } from "../../config/rateLimiter.config";

const router = express.Router();

router.post("/search", verifyToken, aiLimiter, aiSearch);

export default router;
