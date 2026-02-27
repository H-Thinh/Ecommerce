import { Request, Response } from "express";
import paymentMethodModel from "../models/paymentMethodModel";
import {
  paymentMethodValidation,
  updatePaymentMethodValidation,
} from "../validation/paymentMethodValidation";
import {
  CreatePaymentMethodType,
  UpdatePaymentMethodType,
} from "../types/PaymentMethodType";

const createPaymentMethod = async (req: Request, res: Response) => {
  try {
    const { name, code, description, is_active } = req.body || {};

    const paymentMethodData: CreatePaymentMethodType = {
      name,
      code: code?.toUpperCase(),
      description,
      is_active: is_active !== undefined ? Boolean(is_active) : true,
    };

    const errors = paymentMethodValidation(paymentMethodData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const existingPaymentMethod =
      await paymentMethodModel.getPaymentMethodByCode(paymentMethodData.code);
    if (existingPaymentMethod) {
      return res
        .status(400)
        .json({ message: "Mã phương thức thanh toán đã tồn tại" });
    }

    const paymentMethod =
      await paymentMethodModel.createPaymentMethod(paymentMethodData);
    return res.status(201).json({
      message: "Tạo phương thức thanh toán thành công",
      data: paymentMethod,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getAllPaymentMethods = async (req: Request, res: Response) => {
  try {
    const paymentMethods = await paymentMethodModel.getAllPaymentMethods();
    return res.status(200).json({
      message: "Lấy danh sách phương thức thanh toán thành công",
      data: paymentMethods,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getActivePaymentMethods = async (req: Request, res: Response) => {
  try {
    const paymentMethods = await paymentMethodModel.getActivePaymentMethods();
    return res.status(200).json({
      message: "Lấy danh sách phương thức thanh toán hoạt động thành công",
      data: paymentMethods,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getPaymentMethodById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID phương thức thanh toán không hợp lệ" });
    }

    const paymentMethod = await paymentMethodModel.getPaymentMethodById(id);

    if (!paymentMethod) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phương thức thanh toán" });
    }

    return res.status(200).json({
      message: "Lấy thông tin phương thức thanh toán thành công",
      data: paymentMethod,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const updatePaymentMethodById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID phương thức thanh toán không hợp lệ" });
    }

    const existingPaymentMethod =
      await paymentMethodModel.getPaymentMethodById(id);
    if (!existingPaymentMethod) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phương thức thanh toán" });
    }

    const { name, code, description, is_active } = req.body || {};

    const updateData: UpdatePaymentMethodType = {};

    if (name !== undefined) updateData.name = name;
    if (code !== undefined) updateData.code = code.toUpperCase();
    if (description !== undefined) updateData.description = description;
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const errors = updatePaymentMethodValidation(updateData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    // Check if code exists (if updating code)
    if (updateData.code && updateData.code !== existingPaymentMethod.code) {
      const existingCode = await paymentMethodModel.getPaymentMethodByCode(
        updateData.code,
      );
      if (existingCode) {
        return res
          .status(400)
          .json({ message: "Mã phương thức thanh toán đã tồn tại" });
      }
    }

    const paymentMethod = await paymentMethodModel.updatePaymentMethodById(
      id,
      updateData,
    );
    return res.status(200).json({
      message: "Cập nhật phương thức thanh toán thành công",
      data: paymentMethod,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const deletePaymentMethodById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID phương thức thanh toán không hợp lệ" });
    }

    const existingPaymentMethod =
      await paymentMethodModel.getPaymentMethodById(id);
    if (!existingPaymentMethod) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phương thức thanh toán" });
    }

    await paymentMethodModel.deletePaymentMethodById(id);
    return res
      .status(200)
      .json({ message: "Xóa phương thức thanh toán thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const toggleActivePaymentMethod = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const paymentMethoodExist =
      await paymentMethodModel.getPaymentMethodById(id);

    if (!paymentMethoodExist) {
      return res
        .status(400)
        .json({ message: "Không tồn tại phương thức thanh toán này" });
    }

    await paymentMethodModel.toggleActivePaymentMethood(id);

    res.status(200).json({
      message: "Đã chuyển trạng thái của phương thức thanh toán",
      type: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const paymentMethodController = {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  getActivePaymentMethods,
  updatePaymentMethodById,
  deletePaymentMethodById,
  toggleActivePaymentMethod,
};

export default paymentMethodController;
