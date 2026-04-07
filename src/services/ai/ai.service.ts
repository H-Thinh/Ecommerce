import Groq from "groq-sdk";
import { detectIntent, ChatMessage } from "./intent.service";
import prisma from "../../PrismaClient";
import redis from "../../config/redis.config";
import { parseImageJson } from "../../utils/parseImageJson";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const HISTORY_TTL = 60 * 60 * 2; // 2 giờ
const HISTORY_MAX = 10; // giữ tối đa 10 tin gần nhất

const getHistory = async (userId: number): Promise<ChatMessage[]> => {
  const raw = await redis.get(`chat:${userId}`);
  return raw ? JSON.parse(raw) : [];
};

const saveHistory = async (userId: number, history: ChatMessage[]) => {
  const trimmed = history.slice(-HISTORY_MAX);
  await redis.setex(`chat:${userId}`, HISTORY_TTL, JSON.stringify(trimmed));
};

const appendHistory = async (
  userId: number,
  userMsg: string,
  aiMsg: string,
) => {
  const history = await getHistory(userId);
  history.push({ role: "user", content: userMsg });
  history.push({
    role: "assistant",
    content: typeof aiMsg === "string" ? aiMsg : JSON.stringify(aiMsg),
  });
  await saveHistory(userId, history);
};

const chat = async (prompt: string, json = false) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 300,
    ...(json && { response_format: { type: "json_object" } }),
  });
  return completion.choices[0]?.message?.content?.trim() ?? "";
};

const buildContext = (history: ChatMessage[]) => {
  if (!history.length) return "";
  return (
    "Lịch sử hội thoại:\n" +
    history
      .slice(-10)
      .map((m) => `${m.role === "user" ? "Người dùng" : "AI"}: ${m.content}`)
      .join("\n") +
    "\n\n"
  );
};

export const parseUserQuery = async (message: string, userId: number) => {
  const history = await getHistory(userId);
  const intent = await detectIntent(message, history);

  let message_res: string;
  let type: string = "text";
  let data: any = null;

  switch (intent) {
    case "search_product": {
      const r = await handleProductSearch(message, history, userId);
      message_res = r.message;
      data = r.data;
      type = r.type ?? "text";
      break;
    }
    case "size_advice": {
      message_res = await handleSizeAdvice(message, history);
      break;
    }
    case "order_status": {
      const r = await handleOrderStatus(userId, message, history);
      message_res = r.message;
      data = r.data;
      type = r.type ?? "text";
      break;
    }
    case "refund_support": {
      const r = await handleRefund(userId, message, history);
      message_res = r.message;
      data = r.data;
      break;
    }
    default: {
      message_res = await handleGeneral(message, history);
    }
  }

  await appendHistory(userId, message, message_res);

  return { message: message_res, data, type };
};

const handleProductSearch = async (
  message: string,
  history: ChatMessage[],
  userId: number,
) => {
  const context = buildContext(history);
  const raw = await chat(
    `${context}
Trích xuất điều kiện tìm kiếm sản phẩm thời trang. Trả về JSON:

- category: loại sản phẩm CỤ THỂ ("áo thun", "áo khoác", "áo sơ mi", "quần jean", "váy", ...) | null
- season: "SPRING" | "SUMMER" | "AUTUMN" | "WINTER" | "ALL" | null
- maxPrice: số VND | null
- keyword: từ khóa mô tả thêm (ví dụ: "cổ lọ", "form rộng", "basic") | null
- gender: "nam" | "nữ" | null
- color: màu sắc | null
- size: size | null

Quy tắc:
- Nếu có loại cụ thể → đưa vào category
  Ví dụ:
  + "áo thun cổ lọ" → category = "áo thun", keyword = "cổ lọ"
  + "áo khoác mùa đông" → category = "áo khoác"

- Nếu chỉ có từ chung chung:
  + "áo", "quần", "váy" → category = null, keyword = "áo"/"quần"/"váy"

- Chuẩn hóa từ đồng nghĩa:
  + "t-shirt" → "áo thun"
  + "hoodie" → "áo hoodie"
  + "jacket" → "áo khoác"

- Nếu không xác định được → null

Chỉ trả JSON, không giải thích.

Câu: "${message}"
`,
    true,
  );

  let c: any = {};
  try {
    c = JSON.parse(raw);
  } catch {}

  let resolvedProductName = c.keyword;
  let resolvedCategory = c.category;

  if ((!resolvedProductName || !resolvedCategory) && context) {
    const extracted = await chat(
      `${context}
Hãy tìm sản phẩm cụ thể gần nhất được nhắc đến trong hội thoại.

Trả về JSON với format:
{
  "name": string | null,
  "category": string | null
}

Yêu cầu:
- "name": tên sản phẩm cụ thể (KHÔNG bao gồm màu, size)
  Ví dụ: "Áo thun Nike", "Váy hoa dáng dài"

- "category": loại sản phẩm ("áo thun", "váy", "quần jean", ...)

- KHÔNG trả về các từ chung chung như:
  "áo", "quần", "váy" nếu không có thông tin cụ thể

- Nếu không xác định được → trả null

- Chỉ trả JSON, không giải thích
`,
    );

    let ext: any = {};
    try {
      ext = JSON.parse(extracted);
    } catch {}

    resolvedProductName = ext.name;
    resolvedCategory = ext.category;
  }

  let categoryId: number | undefined;
  const finalCategory = c.category || resolvedCategory;
  if (finalCategory) {
    const cat = await prisma.category.findFirst({
      where: {
        name_category: { contains: finalCategory },
      },
    });
    if (cat) categoryId = cat.id;
  }

  let genderId: number | undefined;
  if (c.gender) {
    const gender = await prisma.gender.findFirst({
      where: { name_gender: { contains: c.gender } },
    });
    if (gender) genderId = gender.id;
  }

  let colorId: number | undefined;
  let colorNotFound = false;
  if (c.color) {
    const color = await prisma.color.findFirst({
      where: { name_color: { contains: c.color } },
    });
    if (color) colorId = color.id;
    else colorNotFound = true;
  }

  let sizeId: number | undefined;
  let sizeNotFound = false;
  if (c.size) {
    const size = await prisma.size.findFirst({
      where: {
        OR: [
          { Symbol: { contains: c.size } },
          { name_size: { contains: c.size } },
        ],
      },
    });
    if (size) sizeId = size.id;
    else sizeNotFound = true;
  }

  if (colorNotFound)
    return {
      message: `Không tìm thấy sản phẩm với màu "${c.color}" trong hệ thống.`,
      data: null,
    };
  if (sizeNotFound)
    return {
      message: `Không tìm thấy sản phẩm với size "${c.size}" trong hệ thống.`,
      data: null,
    };

  const views = await prisma.productView.findMany({
    where: { userId },
    orderBy: { viewedAt: "desc" },
    take: 20,
    select: { product: { select: { categoryId: true } } },
  });
  const favoriteCategories = views
    .map((v) => v.product.categoryId)
    .filter((id): id is number => id !== null);

  const checkStock = /còn không|còn hàng|còn size|in stock/i.test(message);

  const products = await prisma.product.findMany({
    where: {
      ...(c.season && {
        OR: [{ season: c.season }, { season: "ALL" }],
      }),
      ...(c.maxPrice && { price: { lte: c.maxPrice } }),
      ...((c.keyword || resolvedProductName) && {
        name_product: { contains: resolvedProductName },
      }),
      ...(categoryId
        ? { categoryId }
        : {
            categoryId: { in: favoriteCategories },
          }),
      ...(genderId && { category: { genderId } }),
      NOT: { status: { name: "Ngừng kinh doanh" } },
      variants: {
        some: {
          ...(colorId && { colorId }),
          ...(sizeId && { sizeId }),
          ...(checkStock && { stock: { gt: 0 } }),
        },
      },
    },
    select: {
      id: true,
      name_product: true,
      price: true,
      season: true,
      slug: true,
      image_url: true,
      category: { select: { name_category: true } },
      sale: {
        select: { discount_type: true, discount_value: true, is_active: true },
      },
      status: { select: { name: true, hex: true } },
    },
    take: 10,
  });

  if (!products.length)
    return { message: "Không tìm thấy sản phẩm phù hợp.", type: "text" };
  return {
    type: "product",
    message: "Đây là các sản phẩm phù hợp với yêu cầu của bạn.",
    data: products.map((product) => {
      return { ...product, image_url:parseImageJson(product.image_url)  };
    }),
  };
};

const handleSizeAdvice = async (message: string, history: ChatMessage[]) => {
  const ctx = buildContext(history);

  const raw = await chat(
    `${ctx}Trích xuất thông tin số đo và sản phẩm từ câu hiện tại và lịch sử hội thoại. Trả về JSON:
{
  "height": number | null,
  "weight": number | null,
  "bust": number | null,
  "waist": number | null,
  "hip": number | null,
  "category": string | null,
  "productName": string | null
}

Câu hiện tại: "${message}"`,
    true,
  );

  let info: any = {};
  try {
    info = JSON.parse(raw);
  } catch {}

  // Xác định category trước để biết cần số đo gì
  let categoryId: number | undefined;
  let resolvedProductName = info.productName;
  let categoryName = info.category?.toLowerCase() ?? "";

  if (!resolvedProductName && ctx) {
    const extracted = await chat(
      `${ctx}Tên sản phẩm gần nhất được nhắc đến trong lịch sử là gì? Chỉ trả về tên sản phẩm, không giải thích. Nếu không có thì trả về "null".`,
    );
    if (extracted && extracted.toLowerCase() !== "null") {
      resolvedProductName = extracted.trim();
    }
  }

  if (resolvedProductName) {
    const product = await prisma.product.findFirst({
      where: { name_product: { contains: resolvedProductName } },
      select: {
        categoryId: true,
        category: { select: { name_category: true } },
      },
    });
    if (product?.categoryId) {
      categoryId = product.categoryId;
      categoryName =
        product.category?.name_category?.toLowerCase() ?? categoryName;
    }
  }

  if (!categoryId && info.category) {
    const cat = await prisma.category.findFirst({
      where: { name_category: { contains: info.category } },
    });
    if (cat) {
      categoryId = cat.id;
      categoryName = cat.name_category.toLowerCase();
    }
  }

  // Validate số đo theo loại sản phẩm
  const isShirt = /áo/.test(categoryName);
  const isPants = /quần/.test(categoryName);
  const isSkirt = /váy/.test(categoryName);

  if (isShirt) {
    if (!((info.bust && info.waist) || (info.height && info.weight)))
      return "Để tư vấn size áo, vui lòng cung cấp số đo ngực và eo (cm), hoặc chiều cao (cm) và cân nặng (kg).";
  } else if (isPants) {
    if (!((info.waist && info.hip) || (info.height && info.weight)))
      return "Để tư vấn size quần, vui lòng cung cấp số đo eo và hông (cm), hoặc chiều cao (cm) và cân nặng (kg).";
  } else if (isSkirt) {
    if (
      !((info.bust && info.waist && info.hip) || (info.height && info.weight))
    )
      return "Để tư vấn size váy, vui lòng cung cấp số đo ngực, eo và hông (cm), hoặc chiều cao (cm) và cân nặng (kg).";
  } else {
    if (!(info.height && info.weight) && !(info.bust || info.waist || info.hip))
      return "Vui lòng cung cấp chiều cao (cm) và cân nặng (kg), hoặc số đo 3 vòng (ngực/eo/hông) để tôi tư vấn size phù hợp.";
  }

  const measurementFilters = [
    info.height && { name: "Chiều cao", value: info.height },
    info.weight && { name: "Cân nặng", value: info.weight },
    info.bust && { name: "Ngực", value: info.bust },
    info.waist && { name: "Eo", value: info.waist },
    info.hip && { name: "Hông", value: info.hip },
  ].filter(Boolean) as { name: string; value: number }[];

  const providedNames = measurementFilters.map((m) => m.name);

  const sizeGuide = await prisma.sizeGuide.findFirst({
    where: {
      ...(categoryId && { categoryId }),
      measurements: {
        every: {
          OR: [
            ...measurementFilters.map((m) => ({
              measurementType: { name: m.name },
              min: { lte: m.value },
              max: { gte: m.value },
            })),
            { measurementType: { name: { notIn: providedNames } } },
          ],
        },
      },
    },
    include: {
      size: true,
      category: { select: { name_category: true } },
      measurements: { include: { measurementType: true } },
    },
  });

  const finalGuide =
    sizeGuide ??
    (await (async () => {
      const allGuides = await prisma.sizeGuide.findMany({
        where: { ...(categoryId && { categoryId }) },
        include: {
          size: true,
          category: { select: { name_category: true } },
          measurements: { include: { measurementType: true } },
        },
      });

      let best: (typeof allGuides)[0] | null = null;
      let bestDist = Infinity;

      for (const guide of allGuides) {
        let totalDist = 0;
        for (const f of measurementFilters) {
          const m = guide.measurements.find(
            (ms) => ms.measurementType.name === f.name,
          );

          if (!m) continue;
          const mid = (m.min + m.max) / 2;
          totalDist += Math.abs(f.value - mid);
        }
        if (totalDist < bestDist) {
          bestDist = totalDist;
          best = guide;
        }
      }
      return best;
    })());

  if (!finalGuide) {
    const desc = measurementFilters
      .map((m) => `${m.name}: ${m.value}`)
      .join(", ");
    return `Với số đo của bạn (${desc}), hiện chưa có bảng size phù hợp trong hệ thống.`;
  }

  const forProduct = resolvedProductName
    ? ` cho ${resolvedProductName}`
    : finalGuide.category
      ? ` cho ${finalGuide.category.name_category}`
      : "";

  const note = !sizeGuide ? " (gần nhất với số đo của bạn)" : "";

  return `Với số đo của bạn, bạn nên mặc size ${finalGuide.size.Symbol} (${finalGuide.size.name_size})${forProduct}${note}.`;
};

const handleOrderStatus = async (
  userId: number,
  message: string,
  history: ChatMessage[],
) => {
  const ctx = buildContext(history);

  const raw = await chat(
    `${ctx}Trích xuất thông tin mã đơn hàng từ câu hiện tại và lịch sử hội thoại. Trả về JSON:
{
  "code": number | null,
}

Câu hiện tại: "${message}"`,
    true,
  );

  let info: any = {};
  try {
    info = JSON.parse(raw);
  } catch {}

  const order = await prisma.order.findFirst({
    where: { userId, id: info.code },
    include: {
      status: true,
      items: { include: { variant: { include: { product: true } } } },
    },
  });

  if (!order) return { message: "Bạn chưa có đơn hàng nào.", data: null };

  const finalInfoOrder = await chat(`
Bạn là nhân viên chăm sóc khách hàng.

Dữ liệu đơn hàng:
${JSON.stringify(order, null, 2)}

Yêu cầu:
- KHÔNG hiển thị JSON/raw data
- ĐƯỢC phép sử dụng dữ liệu để trả lời
- Nếu người dùng hỏi về sản phẩm → liệt kê tên và số lượng
- Nếu thiếu thông tin → trả lời tự nhiên như "hiện chưa có thông tin"
- Trả lời ngắn gọn, dễ hiểu, thân thiện

Câu hỏi:
"${message}"
`);

  const safeOrder = {
    id: order.id,
    status: order.status.name,
    total_price: order.total_price,
    estimated_delivery_at: order.estimated_delivery_at,
    items: order.items.map((item) => ({
      name: item.variant.product.name_product,
      quantity: item.quantity,
    })),
  };

  if (!safeOrder) {
    return {
      type: "text",
      message: "Không tìm thấy đơn hàng",
    };
  }

  return {
    type: "order",
    message: `${finalInfoOrder}`,
    data: safeOrder,
  };
};

const handleRefund = async (
  userId: number,
  message: string,
  history: ChatMessage[],
) => {
  const ctx = buildContext(history);

  const raw = await chat(
    `${ctx}
    Trích xuất thông tin mã đơn hàng từ câu hiện tại và lịch sử hội thoại. Trả về JSON:
  {
    "code": number | null,
  }

  Câu hiện tại: "${message}"`,
    true,
  );

  const order = await prisma.order.findFirst({
    where: {
      userId,
      status: { code: { in: ["DELIVERED", "COMPLETED"] } },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      total_price: true,
      status: { select: { name: true } },
      items: {
        select: {
          id: true,
          quantity: true,
          returns: true,
          variant: {
            select: {
              product: { select: { name_product: true } },
              size: { select: { Symbol: true } },
              color: { select: { name_color: true } },
            },
          },
        },
      },
    },
  });

  if (!order) {
    return {
      message:
        "Bạn không có đơn hàng nào đủ điều kiện trả hàng. Chỉ đơn đã giao mới có thể yêu cầu trả.",
      data: null,
    };
  }

  const returnableItems = order.items.filter((item) => !item.returns);
  if (!returnableItems.length) {
    return {
      message: `Đơn #${order.id} đã có yêu cầu trả hàng trước đó rồi.`,
      data: null,
    };
  }

  const itemList = returnableItems
    .map((item) => {
      const p = item.variant.product.name_product;
      const size = item.variant.size?.Symbol ?? "";
      const color = item.variant.color?.name_color ?? "";
      return `- ${p} (${color} / ${size}) x${item.quantity}`;
    })
    .join("\n");

  return {
    message: `Đơn #${order.id} (${order.status.name}) có thể yêu cầu trả hàng:\n${itemList}\n\nVui lòng vào mục "Đơn hàng" để gửi yêu cầu trả hàng.`,
    data: { orderId: order.id, items: returnableItems },
  };
};

const handleGeneral = async (message: string, history: ChatMessage[]) => {
  const context = buildContext(history);
  try {
    return await chat(
      `${context}Bạn là trợ lý tư vấn thời trang. Trả lời ngắn gọn, thân thiện bằng tiếng Việt.\n\nCâu hỏi: "${message}"`,
    );
  } catch {
    return "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về sản phẩm, size, đơn hàng hoặc trả hàng.";
  }
};
