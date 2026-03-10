import { Request, Response } from "express";
import saleModel from "../models/saleModel";
import {
  saleValidation,
  updateSaleValidation,
} from "../validation/saleValidation";
import SaleType from "../types/SaleType";

const createSale = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      is_active,
    } = req.body || {};

    const saleData: SaleType = {
      name_sale: name,
      description,
      discount_type,
      discount_value: parseFloat(discount_value),
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      is_active: is_active !== undefined ? Boolean(is_active) : true,
    };

    const errors = saleValidation(saleData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const sale = await saleModel.createSale(saleData);
    return res
      .status(201)
      .json({ message: "Tạo khuyến mãi thành công", data: sale });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getAllSales = async (req: Request, res: Response) => {
  try {
    const sales = await saleModel.getAllSales();
    return res
      .status(200)
      .json({ message: "Lấy danh sách khuyến mãi thành công", data: sales });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getActiveSales = async (req: Request, res: Response) => {
  try {
    const sales = await saleModel.getActiveSales();
    return res.status(200).json({
      message: "Lấy danh sách khuyến mãi đang hoạt động thành công",
      data: sales,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const getSaleById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID khuyến mãi không hợp lệ" });
    }

    const sale = await saleModel.getSaleById(id);

    if (!sale) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
    }

    return res
      .status(200)
      .json({ message: "Lấy thông tin khuyến mãi thành công", data: sale });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const updateSaleById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID khuyến mãi không hợp lệ" });
    }

    const existingSale = await saleModel.getSaleById(id);
    if (!existingSale) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
    }

    const {
      name_sale,
      description,
      discount_type,
      discount_value,
      start_date,
      end_date,
      is_active,
    } = req.body || {};

    const updateData: Partial<SaleType> = {};

    if (name_sale !== undefined) updateData.name_sale = name_sale;
    if (description !== undefined) updateData.description = description;
    if (discount_type !== undefined) updateData.discount_type = discount_type;
    if (discount_value !== undefined)
      updateData.discount_value = parseFloat(discount_value);
    if (start_date !== undefined)
      updateData.start_date = start_date ? new Date(start_date) : undefined;
    if (end_date !== undefined)
      updateData.end_date = end_date ? new Date(end_date) : undefined;
    if (is_active !== undefined) updateData.is_active = Boolean(is_active);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const errors = updateSaleValidation(updateData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const sale = await saleModel.updateSaleById(id, updateData);
    return res
      .status(200)
      .json({ message: "Cập nhật khuyến mãi thành công", data: sale });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteSaleById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "ID khuyến mãi không hợp lệ" });
    }

    const existingSale = await saleModel.getSaleById(id);
    if (!existingSale) {
      return res.status(404).json({ message: "Không tìm thấy khuyến mãi" });
    }

    await saleModel.deleteSaleById(id);
    return res.status(200).json({ message: "Xóa khuyến mãi thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const saleController = {
  createSale,
  getAllSales,
  getActiveSales,
  getSaleById,
  updateSaleById,
  deleteSaleById,
};

export default saleController;
