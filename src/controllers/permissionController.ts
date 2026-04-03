import { Request, Response } from "express";
import permissionModel from "../models/permissionModel";
import PermissionType from "../types/PermissionType";

const createPermission = async (req: Request, res: Response) => {
  try {
    const { name, description, groupId, label } = req.body || {};

    const nameExist = await permissionModel.checkName(name);

    if (nameExist) {
      return res.status(400).json({ message: "Trùng name" });
    }

    const intGroupId = parseInt(groupId);

    const permission = await permissionModel.createPermission({
      name,
      description,
      groupId: intGroupId,
      label,
    });

    res.status(201).json({
      message: "Tạo dữ liệu thành công",
      data: permission,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getPermissions = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;

    const permissions = await permissionModel.getPermissions(search);

    res.status(200).json({
      message: "Lấy dữ liệu các quyền thành công",
      data: permissions,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi server",
      type: "error",
    });
  }
};

const updatePermissionById = async (req: Request, res: Response) => {
  try {
    const permissionId = Number(req.params.permissionId);

    const permissionExist =
      await permissionModel.getPermissionById(permissionId);

    if (!permissionExist) {
      return res
        .status(404)
        .json({ message: "Permission không tồn tại", type: "error" });
    }

    const { name, description } = req.body || {};

    if (name) {
      const nameExist = await permissionModel.checkNameExcludeId(
        name,
        permissionId,
      );

      if (nameExist) {
        return res.status(400).json({ message: "Trùng name", type: "error" });
      }
    }

    const dataUpdate: Partial<PermissionType> = {};

    if (name !== undefined) dataUpdate.name = name;
    if (description !== undefined) dataUpdate.description = description;

    if (Object.keys(dataUpdate).length === 0) {
      return res
        .status(400)
        .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
    }

    const permission = await permissionModel.updatePermissionById(
      permissionId,
      dataUpdate,
    );

    res.status(200).json({
      message: "Cập nhật permission thành công",
      data: permission,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const deletePermissionById = async (req: Request, res: Response) => {
  try {
    const permissionId = Number(req.params.permissionId);

    const permissionExist =
      await permissionModel.getPermissionById(permissionId);

    if (!permissionExist) {
      return res
        .status(404)
        .json({ message: "Permission không tồn tại", type: "error" });
    }

    await permissionModel.deletePermissionById(permissionId);

    const remainingPermissions = await permissionModel.getPermissions();

    res.status(200).json({
      message: "Xóa thành công",
      data: remainingPermissions,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getPermissionById = async (req: Request, res: Response) => {
  try {
    const permissionId = Number(req.params.permissionId);

    const permission = await permissionModel.getPermissionById(permissionId);

    if (!permission) {
      return res
        .status(404)
        .json({ message: "Permission không tồn tại", type: "error" });
    }

    res.status(200).json({
      message: "Lấy dữ liệu thành công",
      data: permission,
      type: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const permissionController = {
  getPermissions,
  createPermission,
  getPermissionById,
  deletePermissionById,
  updatePermissionById,
};

export default permissionController;
