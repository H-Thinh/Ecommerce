import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Chưa đăng nhập", type: "error" });
    }

    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
      return res.status(401).json({ message: "Unauthorized", type: "error" });
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    if (decoded.role) {
      (req as AuthenticatedRequest).account = decoded;
    } else {
      (req as AuthenticatedRequest).user = decoded;
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token đã hết hạn",
        type: "error",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Token không hợp lệ hoặc secret không khớp",
        type: "error",
      });
    }

    return res.status(401).json({
      message: "Unauthorized",
      type: "error",
    });
  }
};

export default verifyToken;
