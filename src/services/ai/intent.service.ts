import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export type Intent =
  | "search_product"
  | "size_advice"
  | "order_status"
  | "refund_support"
  | "unknown";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const detectIntent = async (
  message: string,
  history: ChatMessage[] = [],
): Promise<Intent> => {
  const validIntents: Intent[] = [
    "search_product",
    "size_advice",
    "order_status",
    "refund_support",
  ];

  const contextSummary =
    history.length > 0
      ? `Lịch sử hội thoại:\n${history
          .slice(-10)
          .map(
            (m) => `${m.role === "user" ? "Người dùng" : "AI"}: ${m.content}`,
          )
          .join("\n")}\n\n`
      : "";

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `${contextSummary} Dựa vào lịch sử hội thoại (nếu có) và câu hiện tại, phân loại vào đúng 1 intent:
- search_product: tìm kiếm sản phẩm (áo, quần, váy, giày, túi, phụ kiện, v.v.)
- size_advice: tư vấn size, số đo 3 vòng, chiều cao, cân nặng
- order_status: hỏi về đơn hàng, trạng thái đơn
- refund_support: trả hàng, hoàn tiền, đổi hàng
- unknown: không thuộc các loại trên

Chỉ trả về đúng tên intent, không giải thích, không thêm ký tự nào khác.

Câu hiện tại: "${message}"`,
        },
      ],
      temperature: 0,
      max_tokens: 20,
    });

    const text =
      completion.choices[0]?.message?.content?.trim().toLowerCase() ?? "";
    return validIntents.includes(text as Intent) ? (text as Intent) : "unknown";
  } catch {
    return "unknown";
  }
};
