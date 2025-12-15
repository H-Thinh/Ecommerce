import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../type/express";

export const checkRole = (roles: Array<"admin" | "user">) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
