import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export interface OrderConfirmationPayload {
  to: string;
  receiverName: string;
  orderId: number;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  shippingFee: number;
  paymentMethod: string;
  receiverAddress: string;
}

export const sendOrderConfirmationEmail = async (
  payload: OrderConfirmationPayload,
) => {
  const itemRows = payload.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${item.price.toLocaleString("vi-VN")}₫</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333">
      <h2 style="background:#111;color:#fff;padding:16px;margin:0">Xác nhận đơn hàng #${payload.orderId}</h2>
      <div style="padding:20px">
        <p>Xin chào <strong>${payload.receiverName}</strong>,</p>
        <p>Đơn hàng của bạn đã được đặt thành công. Dưới đây là thông tin chi tiết:</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:8px;text-align:left">Sản phẩm</th>
              <th style="padding:8px;text-align:center">SL</th>
              <th style="padding:8px;text-align:right">Giá</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <table style="width:100%;margin-top:8px">
          <tr>
            <td>Phí vận chuyển</td>
            <td style="text-align:right">${payload.shippingFee.toLocaleString("vi-VN")}₫</td>
          </tr>
          <tr>
            <td><strong>Tổng cộng</strong></td>
            <td style="text-align:right"><strong>${payload.totalPrice.toLocaleString("vi-VN")}₫</strong></td>
          </tr>
        </table>

        <hr style="margin:16px 0"/>
        <p><strong>Địa chỉ giao hàng:</strong> ${payload.receiverAddress}</p>
        <p><strong>Phương thức thanh toán:</strong> ${payload.paymentMethod}</p>

        <p style="margin-top:24px;color:#888;font-size:13px">Cảm ơn bạn đã mua hàng!</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Shop" <${process.env.MAIL_USER}>`,
    to: payload.to,
    subject: `Xác nhận đơn hàng #${payload.orderId}`,
    html,
  });
};

export interface OrderStatusUpdatePayload {
  to: string;
  receiverName: string;
  orderId: number;
  statusName: string;
  statusHex: string;
}

export const sendOrderStatusUpdateEmail = async (
  payload: OrderStatusUpdatePayload,
) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333">
      <h2 style="background:#111;color:#fff;padding:16px;margin:0">Cập nhật đơn hàng #${payload.orderId}</h2>
      <div style="padding:20px">
        <p>Xin chào <strong>${payload.receiverName}</strong>,</p>
        <p>Đơn hàng <strong>#${payload.orderId}</strong> của bạn vừa được cập nhật trạng thái:</p>
        <div style="display:inline-block;padding:8px 20px;border-radius:20px;background:${payload.statusHex};color:#fff;font-weight:bold;font-size:16px;margin:12px 0">
          ${payload.statusName}
        </div>
        <p style="margin-top:20px">Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.</p>
        <p style="color:#888;font-size:13px">Cảm ơn bạn đã mua hàng!</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Shop" <${process.env.MAIL_USER}>`,
    to: payload.to,
    subject: `Đơn hàng #${payload.orderId} - ${payload.statusName}`,
    html,
  });
};

export interface VerifyEmailPayload {
  to: string;
  name: string;
  verifyUrl: string;
}

export const sendVerifyEmail = async (payload: VerifyEmailPayload) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333">
      <h2 style="background:#111;color:#fff;padding:16px;margin:0">Xác minh email của bạn</h2>
      <div style="padding:20px">
        <p>Xin chào <strong>${payload.name}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký. Nhấn vào nút bên dưới để xác minh email:</p>
        <a href="${payload.verifyUrl}"
           style="display:inline-block;margin:16px 0;padding:12px 28px;background:#111;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold">
          Xác minh email
        </a>
        <p style="color:#888;font-size:13px">Link có hiệu lực trong 24 giờ. Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Shop" <${process.env.MAIL_USER}>`,
    to: payload.to,
    subject: "Xác minh email của bạn",
    html,
  });
};
