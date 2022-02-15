import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

console.clear();
stan.on("connect", (a) => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    title: "Concern",
    price: 400,
    id: "232323823928323",
  });

  stan.publish("ticket:created", data, (err, guid) => {
    console.log("Event published");
  });
});
