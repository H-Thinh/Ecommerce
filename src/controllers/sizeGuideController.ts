import { Request, Response } from "express";
import sizeGuideModel from "../models/sizeGuideModel";

const createSizeGuide = async (req: Request, res: Response) => {
  try {
    const { categoryId, sizeId, measurementId, min, max } = req.body;

    if (!categoryId || !sizeId || !measurementId) {
      return res.status(400).json({
        message: "Thiếu categoryId, sizeId hoặc measurementId",
      });
    }

    if (min == null || max == null) {
      return res.status(400).json({
        message: "Thiếu min hoặc max",
      });
    }

    if (min > max) {
      return res.status(400).json({
        message: "Min không được lớn hơn Max",
      });
    }

    const sizeGuide = await sizeGuideModel.createSizeGuide({
      categoryId: Number(categoryId),
      sizeId: Number(sizeId),
      measurementId: Number(measurementId),
      min: Number(min),
      max: Number(max),
    });

    return res.status(201).json({
      message: "Tạo size guide thành công",
      data: sizeGuide,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const updateSizeGuideById = async (req: Request, res: Response) => {
  try {
    const { sizeGuideId, sizeMeasurementId } = req.params;

    if (!sizeGuideId || !sizeMeasurementId) {
      return res.status(400).json({
        message: "Thiếu sizeGuideId hoặc sizeMeasurementId",
      });
    }

    const sizeGuideExist = await sizeGuideModel.getSizeGuideById(
      Number(sizeGuideId),
      Number(sizeMeasurementId),
    );

    if (!sizeGuideExist) {
      return res.status(404).json({
        message: "Size guide hoặc measurement không tồn tại",
      });
    }

    const { categoryId, sizeId, measurementId, min, max } = req.body;

    const result = await sizeGuideModel.updateSizeGuideById(
      Number(sizeGuideId),
      Number(sizeMeasurementId),
      {
        categoryId,
        sizeId,
        measurementId,
        min,
        max,
      },
    );

    return res.status(200).json({
      message: "Cập nhật size guide thành công",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const getSizeGuideByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        message: "Thiếu categoryId",
      });
    }

    const sizeGuides = await sizeGuideModel.getSizeGuideByCategory(
      Number(categoryId),
    );

    return res.status(200).json({
      message: "Lấy size guide thành công",
      data: sizeGuides,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const sizeGuideController = {
  createSizeGuide,
  updateSizeGuideById,
  getSizeGuideByCategory,
};

export default sizeGuideController;
