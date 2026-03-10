import { Request, Response } from "express";
import returnModel from "../models/returnModel";

const approveReturnByAdminId = async (req: Request, res: Response) => {
  try {
    const { returnId } = req.params;
    const { status, adminNote } = req.body || {};

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const updatedReturn = await returnModel.approveReturnByAdminId(
      Number(returnId),
      status,
      adminNote,
    );

    const messageMap = {
      APPROVED: "Đã chấp nhận hoàn trả đơn hàng",
      REJECTED: "Đã từ chối yêu cầu hoàn trả đơn hàng",
    };

    return res.status(200).json({
      message:
        messageMap[updatedReturn.status as "APPROVED" | "REJECTED"] ||
        "Cập nhật thành công",
      data: updatedReturn,
    });
  } catch (error: any) {
    if (error.message === "Return not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Return already processed") {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const returnController = { approveReturnByAdminId };

export default returnController;
