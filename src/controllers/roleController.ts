import { Request, Response } from "express";
import roleModel from "../models/roleModel";
import roleValidation from "../validation/roleValidation";
import RoleType from "../types/RoleType";
import { Prisma } from "../generated/prisma";

const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissions } = req.body || {};

    let permissionArr;
    if (Array.isArray(permissions)) {
      permissionArr = permissions.map(Number);
    } else {
      permissionArr = JSON.parse(permissions);
    }

    const roleVali = roleValidation({
      name_role: name,
      description,
      permissions: permissionArr,
    });
    if (Object.keys(roleVali).length > 0) {
      return res.status(404).json(roleVali);
    }

    const nameExist = await roleModel.checkName(name);

    if (nameExist) {
      return res.status(400).json({ message: "Trùng name", type: "error" });
    }

    const role = await roleModel.createRole({
      name_role: name,
      description,
      permissions: permissionArr,
    });
    res
      .status(200)
      .json({ message: "Tạo thành công", data: role, type: "success" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        type: "error",
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({
        message: error.meta?.cause || "Lỗi database",
        type: "error",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      type: "error",
    });
  }
};

const getRoles = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const roles = await roleModel.getRoles();
    const paginatedRoles = roles.slice(startIndex, endIndex);

    res.status(200).json({
      message: "Lấy dữ liệu các role thành công",
      data: paginatedRoles,
      page,
      limit,
      total: roles.length,
      totalPages: Math.ceil(roles.length / limit),
      type: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error, type: "error" });
  }
};

const updateRoleById = async (req: Request, res: Response) => {
  try {
    const roleId = Number(req.params.roleId);

    if (isNaN(roleId)) {
      return res
        .status(400)
        .json({ message: "roleId không hợp lệ", type: "error" });
    }

    const roleExist = await roleModel.getRoleById(roleId);

    if (!roleExist) {
      return res
        .status(404)
        .json({ message: "Role không tồn tại", type: "error" });
    }

    const { name, description } = req.body || {};

    const nameExist = await roleModel.checkNameExcludeId(name, roleId);

    if (nameExist) {
      return res.status(400).json({ message: "Trùng name", type: "error" });
    }

    const dataUpdate: Partial<RoleType> = {};

    if (name !== undefined) dataUpdate.name_role = name;
    if (description !== undefined) dataUpdate.description = description;

    if (Object.keys(dataUpdate).length === 0) {
      return res
        .status(400)
        .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
    }

    const role = await roleModel.updateRoleById(roleId, dataUpdate);

    res.status(200).json({
      message: "Cập nhật role thành công",
      data: role,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const deleteRoleById = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    const intRoleId = parseInt(roleId);

    const roleExist = await roleModel.getRoleById(intRoleId);

    if (!roleExist) {
      return res
        .status(404)
        .json({ message: "Role không tồn tại", type: "error" });
    }

    await roleModel.deleteRoleById(intRoleId);

    const role = await roleModel.getRoles();

    res
      .status(200)
      .json({ message: "Xóa thành công", data: role, type: "success" });
  } catch (error) {
    res.status(500).json({ message: error, type: "error" });
  }
};

const getRoleById = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    const intRoleId = parseInt(roleId);

    const role = await roleModel.getRoleById(intRoleId);

    if (!role) {
      return res
        .status(404)
        .json({ message: "Role không tồn tại", type: "error" });
    }

    res.status(200).json({
      message: "Lấy dữ liệu của role thành công",
      data: role,
      type: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error, type: "error" });
  }
};

const roleController = {
  getRoles,
  createRole,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};

export default roleController;
