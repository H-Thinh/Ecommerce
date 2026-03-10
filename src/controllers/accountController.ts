import { Request, Response } from "express";
import accountModel from "../models/accountModel";
import bcrypt from "bcryptjs";
import AccountType from "../types/AccountType";
import { AuthenticatedRequest } from "../types/express";

const updateAccountById = async (req: Request, res: Response) => {
  try {
    const id = (req as AuthenticatedRequest).user?.id;

    const accountExist = await accountModel.findAccountById(id);

    if (!accountExist) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    const { name, email, password, roleId } = req.body || {};

    const file = req.file;

    if (email) {
      const emailExist = await accountModel.checkEmailExcludeId(email, id);

      if (emailExist) {
        return res.status(400).json({ message: "Trùng email" });
      }
    }

    if (name) {
      const nameExist = await accountModel.checkNameExcludeId(name, id);

      if (nameExist) {
        return res.status(400).json({ message: "Trùng name" });
      }
    }

    const dataUpdate: Partial<AccountType> = {};

    if (file) dataUpdate.avatar = file.path;
    if (name !== undefined) dataUpdate.name = name;
    if (email !== undefined) dataUpdate.email = email;
    if (roleId !== undefined) dataUpdate.roleId = Number(roleId);
    if (password !== undefined) {
      dataUpdate.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const account = await accountModel.updateAccountById(id, dataUpdate);

    res.status(200).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getAccountById = async (req: Request, res: Response) => {
  try {
    const id = (req as AuthenticatedRequest).user?.id;

    const account = await accountModel.getAccountById(id);

    if (!account) {
      return res.status(400).json("Không tồn tại tài khoản này");
    }

    res.status(200).json({ message: "Lấy dữ liệu thành công", data: account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const accountController = {
  getAccountById,
  updateAccountById,
};

export default accountController;
