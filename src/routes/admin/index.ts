import { Router } from "express";

import authRoutes from "./auth.routes";
import roleRoutes from "./role.routes";
import sizeRoutes from "./size.routes";
import cartRoutes from "./cart.routes";
import saleRoutes from "./sale.routes";
import colorRoutes from "./color.routes";
import orderRoutes from "./order.routes";
import adminRoutes from "./admin.routes";
import genderRoutes from "./gender.routes";
import reviewRoutes from "./review.routes";
import returnRoutes from "./return.routes";
import refundRoutes from "./refund.routes";
import voucherRoutes from "./voucher.routes";
import accountRoutes from "./account.routes";
import productRoutes from "./product.routes";
import paymentRoutes from "./payment.routes";
import dailyReportRoutes from "./dailyReport";
import categoryRoutes from "./category.routes";
import pointRuleRoutes from "./pointRule.routes";
import sizeGuideRoutes from "./sizeGuide.routes";
import permissionRoutes from "./permission.routes";
import orderStatusRoutes from "./orderStatus.routes";
import measurementRoutes from "./measurement.routes";
import paymentMethodRoutes from "./paymentMethod.routes";
import productStatusRoutes from "./productStatus.routes";
import permissionGroupRoutes from "./permissionGroup.routes";
import rolePermissionGroupRoutes from "./rolePermissionGroup.routes";

const router = Router();

router.use("/auths", authRoutes);

router.use("/roles", roleRoutes);

router.use("/sizes", sizeRoutes);

router.use("/carts", cartRoutes);

router.use("/sales", saleRoutes);

router.use("/orders", orderRoutes);

router.use("/colors", colorRoutes);

router.use("/admins", adminRoutes);

router.use("/genders", genderRoutes);

router.use("/reviews", reviewRoutes);

router.use("/refunds", refundRoutes);

router.use("/returns", returnRoutes);

router.use("/payments", paymentRoutes);

router.use("/vouchers", voucherRoutes);

router.use("/accounts", accountRoutes);

router.use("/products", productRoutes);

router.use("/categories", categoryRoutes);

router.use("/size-guides", sizeGuideRoutes);

router.use("/point-rules", pointRuleRoutes);

router.use("/permissions", permissionRoutes);

router.use("/measurements", measurementRoutes);

router.use("/daily-reports", dailyReportRoutes);

router.use("/order-statuses", orderStatusRoutes);

router.use("/payment-methods", paymentMethodRoutes);

router.use("/product-statuses", productStatusRoutes);

router.use("/permission-groups", permissionGroupRoutes);

router.use("/role-permission-groups", rolePermissionGroupRoutes);

export default router;
