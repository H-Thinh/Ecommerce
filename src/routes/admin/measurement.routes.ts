import { Router } from "express";

import verifyToken from "../../middlewares/verifyToken";

import measurementController from "../../controllers/measurementController";

const router = Router();

router.post("/", verifyToken, measurementController.createMeasurement);

router.get("/", verifyToken, measurementController.getAllMeasurement);

router.put("/:id", verifyToken, measurementController.updateMeasurementById);

router.delete("/:id", verifyToken, measurementController.deleteMeasurementById);

export default router;
