import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import userModel from "../models/userModel";
import accountModel from "../models/accountModel";

import accountValidation from "../validation/accountValidation";
import {
  userValidation,
  updateUserValidation,
} from "../validation/userValidation";

import AccountType from "../types/AccountType";
import { CreateUserType, UpdateUserType } from "../types/UserType";

const createAccount = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, password, roleId } = req.body || {};

    const accountVali = accountValidation({
      name,
      phone,
      email,
      password,
      roleId,
    });

    if (Object.keys(accountVali).length > 0) {
      return res.status(404).json(accountVali);
    }

    const emailExist = await accountModel.checkEmail(email);

    if (emailExist) {
      return res.status(500).json({ message: "Trùng email" });
    }

    const nameExist = await accountModel.checkName(name);

    if (nameExist) {
      return res.status(500).json({ message: "Trùng name" });
    }

    const intRoleId = parseInt(roleId);

    const passwordCrypto = await bcrypt.hash(String(password), 10);

    const account = await accountModel.createAccount({
      name,
      email,
      phone,
      password: passwordCrypto,
      roleId: intRoleId,
    });

    res.status(200).json({
      message: "Tạo tài khoản thành công",
      data: account,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const updateAccountById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const accountExist = await accountModel.findAccountById(id);

    if (!accountExist) {
      return res
        .status(404)
        .json({ message: "User không tồn tại", type: "error" });
    }

    const { name, email, password, roleId } = req.body || {};

    const file = req.file;

    if (email) {
      const emailExist = await accountModel.checkEmailExcludeId(email, id);

      if (emailExist) {
        return res.status(400).json({ message: "Trùng email", type: "error" });
      }
    }

    if (name) {
      const nameExist = await accountModel.checkNameExcludeId(name, id);

      if (nameExist) {
        return res.status(400).json({ message: "Trùng name", type: "error" });
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
      return res
        .status(400)
        .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
    }

    const account = await accountModel.updateAccountById(id, dataUpdate);

    res.status(200).json({
      message: "Cập nhật tài khoản thành công",
      data: account,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const deleteAccountById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const accountExist = await accountModel.findAccountById(id);
    if (!accountExist) {
      return res
        .status(404)
        .json({ message: "User không tồn tại", type: "error" });
    }

    await accountModel.deleteAccountById(id);

    const remainingAccounts = await accountModel.getAccounts();

    res.status(200).json({
      message: "Xóa tài khoản thành công",
      data: remainingAccounts,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getAccounts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const accounts = await accountModel.getAccounts();

    if (!accounts) {
      return res.status(400).json({
        message: "Không có dữ liệu về tài khoản",
        type: "error",
      });
    }
    const paginatedAccounts = accounts.slice(startIndex, endIndex);

    res.status(200).json({
      message: "Lấy dữ liệu tài khoản thành công",
      data: paginatedAccounts,
      page,
      totalPages: Math.ceil(accounts.length / limit),
      total: accounts.length,
      limit,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, avatar } = req.body || {};

    const userData: CreateUserType = {
      name,
      email,
      password,
      phone,
      address,
      avatar,
    };

    const errors = userValidation(userData);
    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ", data: errors, type: "error" });
    }

    const existingEmail = await userModel.getUserByEmail(email);
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Email đã tồn tại", type: "error" });
    }

    const existingName = await userModel.getUserByName(name);
    if (existingName) {
      return res
        .status(400)
        .json({ message: "Name đã tồn tại", type: "error" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    const user = await userModel.createUser(userData);
    return res.status(201).json({
      message: "Tạo người dùng thành công",
      data: user,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAllUsers();
    return res.status(200).json({
      message: "Lấy danh sách người dùng thành công",
      data: users,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID người dùng không hợp lệ", type: "error" });
    }

    const user = await userModel.getUserById(id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng", type: "error" });
    }

    return res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      data: user,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const updateUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID người dùng không hợp lệ", type: "error" });
    }

    const existingUser = await userModel.getUserById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng", type: "error" });
    }

    const { name, phone, address, email, avatar, points } = req.body || {};

    const existingName = await userModel.checkNameExcludeId(name, id);

    if (!existingName) {
      return res
        .status(400)
        .json({ message: "Name đã tồn tại", type: "error" });
    }

    if (existingUser.points < 0 && points < 0) {
      return res
        .status(400)
        .json({ message: "không thể giảm point đi nữa", type: "error" });
    }

    const updateData: UpdateUserType = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (points !== undefined) updateData.points = points;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
    }

    const errors = updateUserValidation(updateData);
    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ message: "Dữ liệu không hợp lệ", errors, type: "error" });
    }

    const user = await userModel.updateUserById(id, updateData);
    return res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: user,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID người dùng không hợp lệ", type: "error" });
    }

    const existingUser = await userModel.getUserById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng", type: "error" });
    }

    await userModel.deleteUserById(id);
    return res
      .status(200)
      .json({ message: "Xóa người dùng thành công", type: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const adminController = {
  getAccounts,
  createAccount,
  updateAccountById,
  deleteAccountById,
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

export default adminController;
