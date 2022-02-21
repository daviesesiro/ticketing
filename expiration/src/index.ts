import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  console.log("Starting expiration service....");
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID not found");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL not found");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID not found");
  }

  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );

  new OrderCreatedListener(natsWrapper.client).listen();

  natsWrapper.client.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  process.on("SIGINT", () => natsWrapper.client.close());
  process.on("SIGTERM", () => natsWrapper.client.close());
};

start();
