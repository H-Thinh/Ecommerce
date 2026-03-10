import { Request, Response } from "express";
import colorModel from "../models/colorModel";
import ColorType from "../types/ColorType";

const createColor = async (req: Request, res: Response) => {
  try {
    const { name, hex } = req.body || {};

    const nameExist = await colorModel.checkName(name);

    if (nameExist) {
      return res.status(400).json({ message: "Trùng name" });
    }

    const hexExist = await colorModel.checkHex(hex);

    if (hexExist) {
      return res.status(400).json({ message: "Trùng màu" });
    }

    const color = await colorModel.createColor({ name_color: name, hex });

    res.status(201).json({ message: "Tạo dữ liệu thành công", data: color });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getColors = async (req: Request, res: Response) => {
  try {
    const colors = await colorModel.getColors();

    res.status(200).json({ message: "Lấy dữ liệu thành công", data: colors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateColorById = async (req: Request, res: Response) => {
  try {
    const colorId = Number(req.params.colorId);

    const colorExist = await colorModel.findColorById(colorId);

    if (!colorExist) {
      return res.status(404).json({ messsage: "Color không tồn tại" });
    }

    const { name, hex } = req.body || {};

    if (name) {
      const nameExist = await colorModel.checkNameExcludeId(name, colorId);

      if (nameExist) {
        return res.status(400).json({ message: "Trùng name" });
      }
    }

    if (hex) {
      const hexExist = await colorModel.checkHexExcludeId(hex, colorId);

      if (hexExist) {
        return res.status(400).json({ message: "Trùng màu" });
      }
    }

    const dataUpdate: Partial<ColorType> = {};

    if (name !== undefined) dataUpdate.name_color = name;
    if (hex !== undefined) dataUpdate.hex = hex;

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const color = await colorModel.updateColorById(colorId, dataUpdate);

    res.status(200).json({ message: "Cập nhật color thành công", data: color });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteColorById = async (req: Request, res: Response) => {
  try {
    const colorId = Number(req.params.colorId);

    const colorExist = await colorModel.findColorById(colorId);

    if (!colorExist) {
      return res.status(404).json({ messsage: "Color không tồn tại" });
    }

    await colorModel.deleteColorById(colorId);

    const remainingColors = await colorModel.getColors();

    res.status(200).json({ message: "Xóa thành công", data: remainingColors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const colorController = {
  getColors,
  createColor,
  updateColorById,
  deleteColorById,
};

export default colorController;
