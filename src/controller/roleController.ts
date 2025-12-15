import { Request, Response } from "express";
import roleModel from "../model/roleModel";
import roleValidation from "../validation/roleValidation";
import RoleType from "../type/RoleType";

const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const roleVali = roleValidation({ name_role: name, description });
    if (Object.keys(roleVali).length > 0) {
      return res.status(404).json(roleVali);
    }

    const role = await roleModel.createRole({ name_role: name, description });
    res.status(200).json({ message: "Tạo thành công", data: role });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await roleModel.getRoles();
    res.status(200).json({ message: "Lấy dữ liệu thành công", data: roles });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateRoleById = async (req: Request, res: Response) => {
  try {
    const roleId = Number(req.params.roleId);

    if (isNaN(roleId)) {
      return res.status(400).json({ message: "roleId không hợp lệ" });
    }
    console.log(req.body);

    const { name, description } = req.body;

    const roleExist = await roleModel.findRoleById(roleId);
    if (!roleExist) {
      return res.status(404).json({ message: "Role không tồn tại" });
    }

    const dataUpdate: Partial<RoleType> = {};

    if (name !== undefined) dataUpdate.name_role = name;
    if (description !== undefined) dataUpdate.description = description;

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const role = await roleModel.updateRoleById(roleId, dataUpdate);

    res.status(200).json({ message: "Cập nhật role thành công", data: role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteRoleById = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    const intRoleId = parseInt(roleId);

    const roleExist = await roleModel.findRoleById(intRoleId);

    if (!roleExist) {
      return res.status(404).json({ message: "Role không tồn tại" });
    }

    await roleModel.deleteRoleById(intRoleId);

    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const roleController = { createRole, getRoles, updateRoleById, deleteRoleById };

export default roleController;
