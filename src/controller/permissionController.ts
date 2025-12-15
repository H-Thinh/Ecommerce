import { Request, Response } from "express";
import permissionModel from "../model/permissionModel";
import PermissionType from "../type/PermissionType";

const createPermission = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const nameExist = await permissionModel.checkName(name);

    if (nameExist) {
      return res.status(400).json({ message: "Trùng name" });
    }

    const permission = await permissionModel.createPermission({
      name,
      description,
    });

    res.status(201).json({ message: "Thành công", data: permission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await permissionModel.getPermissions();
    res.status(200).json({ message: "Thành công", data: permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updatePermissionById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const { name, description } = req.body;

    if (name) {
      const nameExist = await permissionModel.checkNameExcludeId(name, id);

      if (nameExist) {
        return res.status(400).json({ message: "Trùng name" });
      }
    }

    const dataUpdate: Partial<PermissionType> = {};

    if (name !== undefined) dataUpdate.name = name;
    if (description !== undefined) dataUpdate.description = description;

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const permission = await permissionModel.updatePermissionById(id, {
      name,
      description,
    });

    res
      .status(200)
      .json({ message: "Cập nhật role thành công", data: permission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deletePermission = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const permissionExist = await permissionModel.findPermissionById(id);

    if (!permissionExist) {
      return res.status(404).json({ message: "Permission không tồn tại" });
    }

    await permissionModel.deletePermissionById(id);

    const remainingPermissions = await permissionModel.getPermissions();

    res
      .status(200)
      .json({ message: "Xóa thành công", data: remainingPermissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const permissionController = {
  getPermissions,
  createPermission,
  deletePermission,
  updatePermissionById,
};

export default permissionController;
