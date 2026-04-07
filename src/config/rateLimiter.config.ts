import rateLimit from "express-rate-limit";

// Đăng nhập / đăng ký: 10 lần / 15 phút
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.", type: "error" },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI chatbot: 30 lần / phút (chống spam tốn API key)
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: "Bạn đang gửi quá nhiều tin nhắn, vui lòng chờ một chút.", type: "error" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Tạo đơn hàng / thanh toán: 20 lần / 10 phút
export const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { message: "Quá nhiều yêu cầu đặt hàng, vui lòng thử lại sau.", type: "error" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Gửi email xác minh: 5 lần / giờ
export const verifyEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: "Quá nhiều yêu cầu xác minh email, vui lòng thử lại sau 1 giờ.", type: "error" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chung cho toàn bộ API: 200 lần / phút
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { message: "Quá nhiều yêu cầu, vui lòng thử lại sau.", type: "error" },
  standardHeaders: true,
  legacyHeaders: false,
});
