import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userModel from "../models/userModel";

import {
  userValidation,
  updateUserValidation,
} from "../validation/userValidation";

import { CreateUserType, UpdateUserType } from "../types/UserType";

import { AuthenticatedRequest } from "../types/express";
import { publishVerifyEmail } from "../services/rabbitmq/order/order.producer";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body || {};

    const userData: CreateUserType = { name, email, password, phone };

    const errors = userValidation(userData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", data: errors, type: "error" });
    }

    const existingEmail = await userModel.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã tồn tại", type: "error" });
    }

    const existingName = await userModel.getUserByName(name);
    if (existingName) {
      return res.status(400).json({ message: "Name đã tồn tại", type: "error" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    userData.password = hashedPassword;

    const user = await userModel.createUser(userData);

    // Tạo verify token hết hạn 24h
    const verifyToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" },
    );

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verifyToken}`;

    publishVerifyEmail({ to: user.email, name: user.name, verifyUrl });

    return res.status(201).json({
      message: "Tạo người dùng thành công. Vui lòng kiểm tra email để xác minh tài khoản.",
      type: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt((req as AuthenticatedRequest).user?.userId);

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
    const id = parseInt((req as AuthenticatedRequest).user?.id);

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

const userController = {
  createUser,
  getUserById,
  updateUserById,
};

export default userController;
