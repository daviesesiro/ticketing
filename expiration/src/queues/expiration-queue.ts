import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}
const expQueue = new Queue<Payload>("orders:epxiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expQueue.process(async (job) => {
  console.log(
    "I want to publish expiration:complete event orderId:",
    job.data.orderId
  );

  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expQueue };
