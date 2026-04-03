import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { parseUserQuery } from "../services/ai/ai.service";

export const aiSearch = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Thiếu nội dung tin nhắn." });
    }

    const userId = req.user?.id as number;

    const { message: msg, data, type } = await parseUserQuery(message, userId);

    res.json({ success: true, message: msg, data, role: "assistant", type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI error" });
  }
};
