import { Request, Response } from "express";
import measurementModel from "../models/measurementModel";

const createMeasurement = async (req: Request, res: Response) => {
  try {
    const { name, unit } = req.body || {};

    if (!name || !unit) {
      return res.status(400).json({
        message: "Thiếu name hoặc unit",
      });
    }

    const nameExist = await measurementModel.checkName(name);

    if (nameExist) {
      return res.status(400).json({
        message: "Tên đo lường đã tồn tại",
      });
    }

    const measurement = await measurementModel.createMeasurement({
      name,
      unit,
    });

    return res
      .status(200)
      .json({ message: "Thêm tên đo lường mới thành công", data: measurement });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi" });
  }
};

const getAllMeasurement = async (req: Request, res: Response) => {
  try {
    const measurements = await measurementModel.getAllMeasurement();

    return res.status(200).json({
      message: "Lấy danh sách đo lường thành công",
      data: measurements || [],
    });
  } catch (error) {
    console.error("getAllMeasurement error:", error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const updateMeasurementById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID đo lường không hợp lệ",
      });
    }

    const measurementExist = await measurementModel.getMeasurementById(id);

    if (!measurementExist) {
      return res.status(404).json({
        message: "Measurement không tồn tại",
      });
    }

    const { name, unit } = req.body || {};

    if (!name || !unit) {
      return res.status(400).json({
        message: "Thiếu name hoặc unit",
      });
    }

    const nameExist = await measurementModel.checkName(name);

    if (nameExist && nameExist.id !== id) {
      return res.status(400).json({
        message: "Tên đo lường đã tồn tại",
      });
    }

    const measurement = await measurementModel.updateMeasurementById(id, {
      name,
      unit,
    });

    return res.status(200).json({
      message: "Cập nhật đo lường thành công",
      data: measurement,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const deleteMeasurementById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "ID đo lường không hợp lệ",
      });
    }

    const measurementExist = await measurementModel.getMeasurementById(id);

    if (!measurementExist) {
      return res.status(404).json({
        message: "Measurement không tồn tại",
      });
    }

    await measurementModel.deleteMeasurementById(id);

    return res.status(200).json({
      message: "Xóa đo lường thành công",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const measurementController = {
  createMeasurement,
  getAllMeasurement,
  updateMeasurementById,
  deleteMeasurementById,
};

export default measurementController;
