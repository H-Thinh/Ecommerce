import productModel from "../../../models/productModel";
import { getChannel } from "../connection";
import { QUEUES } from "../queues";

const startUpdateProductStatus = async () => {
  const channel = getChannel();
  await channel.assertQueue(QUEUES.PRODUCT_STATUS, { durable: true });

  channel.consume(QUEUES.PRODUCT_STATUS, async (msg) => {
    if (!msg) return;

    try {
      const { productId } = JSON.parse(msg.content.toString());

      const product = await productModel.getProductById(productId);
      if (!product) {
        channel.ack(msg);
        return;
      }

      const sumStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

      let newStatusId: number | null = null;

      if (sumStock === 0)
        newStatusId = 2; // hết hàng
      else if (sumStock >= 50) newStatusId = 1; // còn nhiều

      if (!newStatusId || product.statusId === newStatusId) {
        channel.ack(msg);
        return;
      }

      await productModel.updateProductStatusById(productId, newStatusId);

      channel.ack(msg);
    } catch (err) {
      console.error("Product consumer error:", err);
      channel.nack(msg, false, false);
    }
  });
};

const productConsumer = { startUpdateProductStatus };

export default productConsumer;
