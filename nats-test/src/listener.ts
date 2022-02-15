import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
console.clear();

const clientId = randomBytes(4).toString("hex");
console.log("client id", clientId);

const stan = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const opts = stan.subscriptionOptions().setManualAckMode(true);
  stan
    .subscribe("ticket:created", "listenerQGroup", opts)
    .on("message", (msg: Message) => {
      console.log(`#${msg.getSequence()} === ${msg.getData()}`);
      msg.ack();
    });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
