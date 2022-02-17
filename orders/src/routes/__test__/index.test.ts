import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = () => {
  return Ticket.create({ title: "Concert", price: 200 });
};

describe("Get user orders", () => {
  it("it fetches user orders", async () => {
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = global.signup();
    const user2 = global.signup();

    const { body: order1 } = await request(app)
      .post("/api/orders")
      .send({ ticketId: ticket1._id })
      .set("Cookie", user1)
      .expect(201);

    const { body: order2 } = await request(app)
      .post("/api/orders")
      .send({ ticketId: ticket2._id })
      .set("Cookie", user2)
      .expect(201);

    const { body: order3 } = await request(app)
      .post("/api/orders")
      .send({ ticketId: ticket3._id })
      .set("Cookie", user2)
      .expect(201);

    // get orders for user1
    await request(app)
      .get("/api/orders")
      .set("Cookie", user1)
      .then((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toEqual(order1.id);
      });

    //get order for user2
    await request(app)
      .get("/api/orders")
      .set("Cookie", user2)
      .then((res) => {
        expect(res.body).toHaveLength(2);
        expect(res.body[0].id).toEqual(order2.id);
        expect(res.body[0].ticket.id).toEqual(ticket2.id);
        expect(res.body[1].id).toEqual(order3.id);
        expect(res.body[1].ticket.id).toEqual(ticket3.id);
      });
  });
});
