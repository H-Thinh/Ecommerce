import { Request, Response } from "express";
import authModel from "../model/authModel";
import jwt from "jsonwebtoken";

function createJWT(userId: number, username: string, role: string) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ userId, username, role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const checkLogin = await authModel.loginAccount({ email, password });

  if (!checkLogin.success) {
    return res.status(400).json(checkLogin);
  }

  const token = createJWT(
    checkLogin.data.id,
    checkLogin.data.name,
    checkLogin.data.role
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 60 * 1000,
  });

  res.json({ message: "Đăng nhập thành công", token });
};

const authController = { loginUser };

export default authController;
