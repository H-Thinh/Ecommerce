import { publish } from "../publisher";
import { QUEUES } from "../queues";

const publishProductStatusChanged = async (productId: number) => {
  publish(QUEUES.PRODUCT_STATUS, { productId });
};

const productProducer = {
  publishProductStatusChanged,
};
export default productProducer;
