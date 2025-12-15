import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../type/express";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Token đã hết hạn",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: "Token không hợp lệ hoặc secret không khớp",
      });
    }

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
