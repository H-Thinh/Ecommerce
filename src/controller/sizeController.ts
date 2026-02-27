import { Request, Response } from "express";
import sizeModel from "../models/sizeModel";
import SizeType from "../types/SizeType";

const createSize = async (req: Request, res: Response) => {
  try {
    const { name, symbol } = req.body || {};

    const nameExist = await sizeModel.checkName(name);

    if (nameExist) {
      return res.status(400).json({ message: "Trùng name" });
    }

    const size = await sizeModel.createSize({
      name_size: name,
      Symbol: symbol,
    });

    res.status(201).json({ message: "Tạo dữ liệu thành công", data: size });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getSizes = async (req: Request, res: Response) => {
  try {
    const sizes = await sizeModel.getSizes();
    res.status(200).json({ message: "Lấy dữ liệu thành công", data: sizes });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateSizeById = async (req: Request, res: Response) => {
  try {
    const sizeId = Number(req.params.sizeId);

    const { name, Symbol } = req.body || {};

    if (name) {
      const nameExist = await sizeModel.checkNameExcludeId(name, sizeId);

      if (nameExist) {
        return res.status(400).json({ message: "Trùng name" });
      }
    }

    const dataUpdate: Partial<SizeType> = {};

    if (name !== undefined) dataUpdate.name_size = name;
    if (Symbol !== undefined) dataUpdate.Symbol = Symbol;

    if (Object.keys(dataUpdate).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    const size = await sizeModel.updateSizeById(sizeId, dataUpdate);

    res.status(200).json({ message: "Cập nhật size thành công", data: size });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deleteSizeById = async (req: Request, res: Response) => {
  try {
    const sizeId = Number(req.params.sizeId);

    const sizeExist = await sizeModel.findSizeById(sizeId);

    if (!sizeExist) {
      return res.status(404).json({ message: "size Không tồn tại" });
    }

    await sizeModel.deleteSizeById(sizeId);

    const remainingSize = await sizeModel.getSizes();

    res.status(200).json({ message: "Xóa thành công ", data: remainingSize });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const sizeController = { getSizes, createSize, updateSizeById, deleteSizeById };

export default sizeController;
