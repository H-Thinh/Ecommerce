import { Request, Response } from "express";
import authModel from "../models/authModel";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express";

function createJWTAccount(accountId: number, username: string, role: string) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ accountId, username, role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

function createJWTUser(
  userId: number,
  username: string,
  avatar: string,
  points: number,
  email: string,
) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign(
    { userId, username, avatar, points, email },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );
  return token;
}

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    const checkLogin = await authModel.loginUser({ email, password });

    if (!checkLogin.success) {
      return res.status(401).json(checkLogin.errors);
    }

    const token = createJWTUser(
      checkLogin.id,
      checkLogin.username,
      checkLogin.avatar ?? "",
      checkLogin.points,
      checkLogin.email,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: checkLogin,
      type: "success",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const loginAccount = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    const checkLogin = await authModel.loginAccount({ email, password });

    if (!checkLogin.success) {
      return res.status(401).json(checkLogin);
    }

    const token = createJWTAccount(
      checkLogin.id,
      checkLogin.username,
      checkLogin.role,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: checkLogin,
      type: "success",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res
    .status(200)
    .json({ message: "Đăng xuất thành công", type: "success" });
};

const getInfoAccount = async (req: Request, res: Response) => {
  try {
    const account = (req as AuthenticatedRequest).account!;

    res.status(200).json({
      message: "Lấy thông tin thành công",
      data: account,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getInfoUser = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user!;

    res.status(200).json({
      message: "Lấy thông tin thành công",
      data: user,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};
const authController = {
  logout,
  loginUser,
  getInfoUser,
  loginAccount,
  getInfoAccount,
};

export default authController;
