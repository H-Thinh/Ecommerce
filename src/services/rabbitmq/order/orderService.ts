// // import orderModel from "../../models/orderModel";
// // import prisma from "../../PrismaClient";

// // Service functions for RabbitMQ consumers
// export const updateOrderStatus = async (orderId: number, statusId: number) => {
//   try {
//     return await orderModel.updateOrderById(orderId, { statusId });
//   } catch (error) {
//     console.error(`Failed to update order ${orderId} status:`, error);
//     throw error;
//   }
// };

// export const processOrderStock = async (orderId: number) => {
//   try {
//     // Get order items
//     const order = await orderModel.getOrderById(orderId);
//     if (!order) {
//       throw new Error(`Order ${orderId} not found`);
//     }

//     // Update stock for each item
//     for (const item of order.items) {
//       const variant = await prisma.productVariant.findUnique({
//         where: { id: item.variantId },
//       });

//       if (!variant) {
//         throw new Error(`Variant ${item.variantId} not found`);
//       }

//       if (variant.stock < item.quantity) {
//         // Not enough stock - cancel order
//         await updateOrderStatus(orderId, 5); // Cancelled status
//         throw new Error(`Not enough stock for variant ${item.variantId}`);
//       }

//       // Update stock
//       await prisma.productVariant.update({
//         where: { id: item.variantId },
//         data: {
//           stock: { decrement: item.quantity },
//           sold: { increment: item.quantity },
//         },
//       });

//       // Update product sold count
//       await prisma.product.update({
//         where: { id: variant.productId },
//         data: {
//           sold: { increment: item.quantity },
//         },
//       });
//     }

//     // Update order status to confirmed
//     await updateOrderStatus(orderId, 2); // Confirmed status

//     return { success: true, orderId };
//   } catch (error) {
//     console.error(`Failed to process stock for order ${orderId}:`, error);
//     throw error;
//   }
// };

// export const processOrderPayment = async (
//   orderId: number,
//   paymentData: any
// ) => {
//   try {
//     // Create payment record
//     await prisma.payment.create({
//       data: {
//         orderId,
//         amount: paymentData.amount,
//         status: paymentData.status,
//         payment_method: paymentData.payment_method,
//         transaction_reference: paymentData.transaction_reference,
//         payment_date: new Date(),
//       },
//     });

//     // Update order status based on payment
//     const statusId = paymentData.status === "success" ? 3 : 6; // Paid or Payment Failed
//     await updateOrderStatus(orderId, statusId);

//     return { success: true, orderId, paymentStatus: paymentData.status };
//   } catch (error) {
//     console.error(`Failed to process payment for order ${orderId}:`, error);
//     throw error;
//   }
// };

// export const cancelOrder = async (orderId: number, reason: string) => {
//   try {
//     // Restore stock if order was confirmed
//     const order = await orderModel.getOrderById(orderId);
//     if (order && order.statusId === 2) {
//       // If confirmed
//       for (const item of order.items) {
//         await prisma.productVariant.update({
//           where: { id: item.variantId },
//           data: {
//             stock: { increment: item.quantity },
//             sold: { decrement: item.quantity },
//           },
//         });
//       }
//     }

//     // Update order status to cancelled
//     await updateOrderStatus(orderId, 5); // Cancelled status

//     return { success: true, orderId, reason };
//   } catch (error) {
//     console.error(`Failed to cancel order ${orderId}:`, error);
//     throw error;
//   }
// };
