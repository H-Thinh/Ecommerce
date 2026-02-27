import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/express";

export const checkPermission = (permissionCode: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.permissions.includes(permissionCode)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
