import { Request, Response } from "express";
import pointRuleModel from "../models/pointRuleModel";
import { CreatePointRule, UpdatePointRule } from "../types/PointRuleType";

const createPointRule = async (req: Request, res: Response) => {
  try {
    const { point, discount_type, discount_value } = req.body || {};

    const pointNum = Number(point);

    const pointExist = await pointRuleModel.checkPoint(pointNum);

    if (pointExist) {
      return res
        .status(400)
        .json({ message: "Lỗi: đã có quy tắc về point này", type: "error" });
    }

    const data: CreatePointRule = {
      discount_type,
      discount_value,
      required_points: pointNum,
    };

    const pointRule = await pointRuleModel.createPointRule(data);

    res.status(201).json({
      message: "Tạo dữ liệu thành công",
      type: "success",
      data: pointRule,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getPointRules = async (req: Request, res: Response) => {
  try {
    const pointRules = await pointRuleModel.getAllPointRules();

    res.status(200).json({
      message: "Lấy dữ liệu các quy tắc điểm thưởng thành công",
      type: "success",
      data: pointRules,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const updatePointRuleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const pointRuleExist = await pointRuleModel.getPointRuleById(id);

    if (!pointRuleExist) {
      return res.status(400).json({ message: "Không tồn tại điểm thưởng này" });
    }

    const { point, discount_type, discount_value, is_active } = req.body || {};

    const updateData: UpdatePointRule = {};

    if (point !== undefined) updateData.required_points = point;
    if (discount_type !== undefined) updateData.discount_type = discount_type;
    if (discount_value !== undefined)
      updateData.discount_value = discount_value;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "Không có dữ liệu để cập nhật", type: "error" });
    }

    const pointRule = await pointRuleModel.updatePointRuleById(id, updateData);

    return res.status(200).json({
      message: "Cập nhật quy tắc điểm thưởng thành công",
      type: "success",
      data: pointRule,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const deletePointRuleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const pointRuleExist = await pointRuleModel.getPointRuleById(id);

    if (!pointRuleExist) {
      return res.status(400).json({ message: "Không tồn tại điểm thưởng này" });
    }

    await pointRuleModel.deletePointRuleById(id);

    const pointRules = await pointRuleModel.getAllPointRules();

    res.status(200).json({
      message: "Xóa dữ liệu các quy tắc điểm thưởng thành công",
      type: "success",
      data: pointRules,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const getPointRuleById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const pointRule = await pointRuleModel.getPointRuleById(id);

    if (!pointRule) {
      return res.status(400).json({ message: "Không tồn tại điểm thưởng này" });
    }

    res.status(200).json({
      message: "Lấy dữ liệu quy tắc điểm thưởng thành công",
      type: "success",
      data: pointRule,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const toggleActivePointRule = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const pointRuleExist = await pointRuleModel.getPointRuleById(id);

    if (!pointRuleExist) {
      return res.status(400).json({ message: "Không tồn tại điểm thưởng này" });
    }

    await pointRuleModel.toggleActivePointRule(id);
    res.status(200).json({
      message: "Đã chuyển trạng thái của điểm thưởng",
      type: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", type: "error" });
  }
};

const pointRuleController = {
  getPointRules,
  createPointRule,
  getPointRuleById,
  updatePointRuleById,
  deletePointRuleById,
  toggleActivePointRule,
};

export default pointRuleController;
