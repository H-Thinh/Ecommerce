import { Request, Response } from "express";
import productStatusModel from "../models/productStatusModel";
import {
  productStatusValidation,
  updateProductStatusValidation,
} from "../validation/productStatusValidation";
import ProductStatusType from "../types/ProductStatusType";

const createProductStatus = async (req: Request, res: Response) => {
  try {
    const { name, description, hex } = req.body || {};

    const productStatusData: ProductStatusType = {
      name,
      description,
      hex,
    };

    const errors = productStatusValidation(productStatusData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Check if name exists
    const existingProductStatus =
      await productStatusModel.getProductStatusByName(name);
    if (existingProductStatus) {
      return res
        .status(400)
        .json({ message: "Tên trạng thái sản phẩm đã tồn tại" });
    }

    const productStatus =
      await productStatusModel.createProductStatus(productStatusData);
    return res.status(201).json({
      message: "Tạo trạng thái sản phẩm thành công",
      data: productStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getAllProductStatuses = async (req: Request, res: Response) => {
  try {
    const productStatuses = await productStatusModel.getAllProductStatuses();
    return res.status(200).json({
      message: "Lấy danh sách trạng thái sản phẩm thành công",
      data: productStatuses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getProductStatusById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID trạng thái sản phẩm không hợp lệ" });
    }

    const productStatus = await productStatusModel.getProductStatusById(id);

    if (!productStatus) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy trạng thái sản phẩm" });
    }

    return res.status(200).json({
      message: "Lấy thông tin trạng thái sản phẩm thành công",
      data: productStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const updateProductStatusById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID trạng thái sản phẩm không hợp lệ" });
    }

    const existingProductStatus =
      await productStatusModel.getProductStatusById(id);
    if (!existingProductStatus) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy trạng thái sản phẩm" });
    }

    const { name, description } = req.body || {};

    const updateData: Partial<ProductStatusType> = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const errors = updateProductStatusValidation(updateData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Check if name exists (if updating name)
    if (updateData.name && updateData.name !== existingProductStatus.name) {
      const duplicateProductStatus =
        await productStatusModel.getProductStatusByName(updateData.name);
      if (duplicateProductStatus) {
        return res
          .status(400)
          .json({ message: "Tên trạng thái sản phẩm đã tồn tại" });
      }
    }

    const productStatus = await productStatusModel.updateProductStatusById(
      id,
      updateData,
    );
    return res.status(200).json({
      message: "Cập nhật trạng thái sản phẩm thành công",
      data: productStatus,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteProductStatusById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID trạng thái sản phẩm không hợp lệ" });
    }

    const existingProductStatus =
      await productStatusModel.getProductStatusById(id);
    if (!existingProductStatus) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy trạng thái sản phẩm" });
    }

    await productStatusModel.deleteProductStatusById(id);
    return res
      .status(200)
      .json({ message: "Xóa trạng thái sản phẩm thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const productStatusController = {
  createProductStatus,
  getAllProductStatuses,
  getProductStatusById,
  updateProductStatusById,
  deleteProductStatusById,
};

export default productStatusController;
