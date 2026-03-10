import { publish } from "../publisher";
import { QUEUES } from "../queues";

const publishProductStatusChanged = async (productId: number) => {
  publish(QUEUES.PRODUCT_STATUS, { productId });
};

const publishProductDecreaseStock = async (
  variantId: number,
  quantity: number,
) => {
  publish(QUEUES.PRODUCT_STOCK_DECREASE, { variantId, quantity });
};

const publishProductIncreaseStock = async (
  variantId: number,
  quantity: number,
) => {
  publish(QUEUES.PRODUCT_STOCK_INCREASE, { variantId, quantity });
};

const productProducer = {
  publishProductIncreaseStock,
  publishProductStatusChanged,
  publishProductDecreaseStock,
};
export default productProducer;
