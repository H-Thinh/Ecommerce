import { Request, Response } from "express";
import voucherModel from "../models/voucherModel";
import VoucherType from "../types/VoucherType";
import { AuthenticatedRequest } from "../types/express";

const createVoucher = async (req: Request, res: Response) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
      usage_limit,
    } = req.body || {};

    const toLocalDate = (date: string) => {
      const [y, m, d] = date.split("-").map(Number);
      return new Date(y, m - 1, d, 0, 0, 0);
    };

    const codeExist = await voucherModel.checkCode(code);

    if (codeExist) {
      return res.status(400).json({ message: "Trùng code" });
    }

    const voucher = await voucherModel.createVoucher({
      code: code.toUpperCase(),
      description,
      discount_type,
      discount_value,
      min_order_value,
      start_date: toLocalDate(start_date),
      end_date: toLocalDate(end_date),
      usage_limit: Number(usage_limit),
    });

    res.status(201).json({ message: "Tạo dữ liệu thành công", data: voucher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getVouchers = async (req: Request, res: Response) => {
  try {
    const vouchers = await voucherModel.getVouchers();
    res.status(200).json({ message: "Lấy dữ liệu thành công", data: vouchers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateVoucherById = async (req: Request, res: Response) => {
  try {
    const voucherId = Number(req.params.voucherId);

    const voucherExist = await voucherModel.findVoucherById(voucherId);

    if (!voucherExist) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_value,
      start_date,
      end_date,
      usage_limit,
    } = req.body || {};

    if (code) {
      const codeExist = await voucherModel.checkCodeExcludeId(code, voucherId);

      if (codeExist) {
        return res.status(400).json({ message: "Trùng name" });
      }
    }

    const dataUpdate: Partial<VoucherType> = {};

    if (code !== undefined) dataUpdate.code = code;
    if (description !== undefined) dataUpdate.description = description;
    if (discount_type !== undefined) dataUpdate.discount_type = discount_type;
    if (discount_value !== undefined)
      dataUpdate.discount_value = discount_value;
    if (min_order_value !== undefined)
      dataUpdate.min_order_value = min_order_value;
    if (start_date !== undefined) dataUpdate.start_date = start_date;
    if (end_date !== undefined) dataUpdate.end_date = end_date;
    if (usage_limit !== undefined) dataUpdate.usage_limit = usage_limit;

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const voucher = await voucherModel.updateVoucherById(voucherId, dataUpdate);

    res
      .status(200)
      .json({ message: "Cập nhật permission thành công", data: voucher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteVoucherById = async (req: Request, res: Response) => {
  try {
    const voucherId = Number(req.params.voucherId);

    const voucherExist = await voucherModel.findVoucherById(voucherId);

    if (!voucherExist) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }

    await voucherModel.deleteVoucherById(voucherId);

    const remainingVouchers = await voucherModel.getVouchers();

    res
      .status(200)
      .json({ message: "Xóa thành công", data: remainingVouchers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getVoucherByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const { total } = req.query;

    if (!total || isNaN(Number(total))) {
      return res.status(400).json({
        message: "Tổng đơn hàng không hợp lệ",
      });
    }

    const userId = Number((req as AuthenticatedRequest).user?.userId);

    if (!userId) {
      return res.status(401).json({
        message: "Không xác thực người dùng",
      });
    }

    const voucher = await voucherModel.getVoucherByCode(
      code,
      Number(total),
      userId,
    );

    return res.status(200).json({
      message: "Áp dụng voucher thành công",
      data: voucher,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Lỗi server",
    });
  }
};

const voucherController = {
  getVouchers,
  createVoucher,
  getVoucherByCode,
  updateVoucherById,
  deleteVoucherById,
};

export default voucherController;
