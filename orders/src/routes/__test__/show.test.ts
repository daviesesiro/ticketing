import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

describe("get an order", () => {
  it("fetches the order", async () => {
    const ticket = await Ticket.create({ title: "Concert", price: 200 });
    const user = global.signup();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get("/api/orders/" + order.id)
      .set("Cookie", user)
      .then((res) => {
        expect(res.body.id).toEqual(order.id);
      });
  });

  it("returns an error if one user trys to get another user's order", async () => {
    const ticket = await Ticket.create({ title: "Concert", price: 200 });
    const user = global.signup();

    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", user)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get("/api/orders/" + order.id)
      .set("Cookie", global.signup())
      .expect(401);
  });
});
