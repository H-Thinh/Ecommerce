import { Router } from "express";

import aiRoutes from "./ai.routes";
import authRoutes from "./auth.routes";
import sizeRoutes from "./size.routes";
import cartRoutes from "./cart.routes";
import userRoutes from "./user.routes";
import orderRoutes from "./order.routes";
import colorRoutes from "./color.routes";
import genderRoutes from "./gender.routes";
import reviewRoutes from "./review.routes";
import paymentRoutes from "./payment.routes";
import voucherRoutes from "./voucher.routes";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import orderStatusRoutes from "./orderStatus.routes";
import bankAccountRoutes from "./userBankAccount.routes";
import paymentMethodRoutes from "./paymentMethod.routes";

const router = Router();

router.use("/ai", aiRoutes);

router.use("/auths", authRoutes);

router.use("/sizes", sizeRoutes);

router.use("/carts", cartRoutes);

router.use("/users", userRoutes);

router.use("/orders", orderRoutes);

router.use("/colors", colorRoutes);

router.use("/genders", genderRoutes);

router.use("/reviews", reviewRoutes);

router.use("/payments", paymentRoutes);

router.use("/vouchers", voucherRoutes);

router.use("/products", productRoutes);

router.use("/categories", categoryRoutes);

router.use("/bank-accounts", bankAccountRoutes);

router.use("/order-statuses", orderStatusRoutes);

router.use("/payment-methods", paymentMethodRoutes);

export default router;
