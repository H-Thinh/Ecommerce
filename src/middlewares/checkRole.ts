import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/express";

export const checkRole = (roles: Array<"admin" | "user">) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.account || !roles.includes(req.account.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
