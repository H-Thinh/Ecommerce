import { Request, Response } from "express";

import { AuthenticatedRequest } from "../types/express";

import userBankAccountModel from "../models/userBankAccountModel";

const createUserBankAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const { bankCode, bankName, accountNo, accountName } = req.body;

    if (!bankCode || !bankName || !accountNo || !accountName) {
      return res.status(400).json({
        message: "Thiếu thông tin tài khoản ngân hàng",
      });
    }

    const bank = await userBankAccountModel.createUserBankAccount({
      accountName,
      accountNo,
      bankCode,
      bankName,
      userId,
    });

    return res.status(200).json({
      message: "Tạo ngân hàng thành công",
      data: bank,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const togglePrimaryUserbankAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const { id } = req.params;

    const bank = await userBankAccountModel.togglePrimaryUserbankAccount(
      Number(id),
      userId,
    );

    return res.status(200).json({
      message: "Chuyển đổi thành công",
      data: bank,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const getAllUserBankAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    const banks = await userBankAccountModel.getAllUserBankAccount(userId);

    return res.status(200).json({
      message: "Lấy danh sách tài khoản ngân hàng thành công",
      data: banks ?? [],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const userBankAccountController = {
  createUserBankAccount,
  getAllUserBankAccount,
  togglePrimaryUserbankAccount,
};

export default userBankAccountController;
