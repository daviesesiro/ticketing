import nats from "node-nats-streaming";
import { TicketCreatedPublish as TicketCreatedPublisher } from "./events/ticket-created-publisher";

const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

console.clear();
stan.on("connect", async (a) => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      title: "Concern",
      price: 400,
      id: "232323823928323",
    });
  } catch (err) {
    console.error(err);
  }
});
