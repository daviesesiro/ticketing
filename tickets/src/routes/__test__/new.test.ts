import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";

describe("Create new ticket", () => {
  it("Has a route handler to /api/tickets for post requests", async () => {
    await request(app)
      .post("/api/tickets")
      .send({})
      .then((res) => expect(res.status).not.toEqual(404));
  });

  it("Can only be access if user is signed in", async () => {
    await request(app)
      .post("/api/tickets")
      .send({})
      .then((res) => expect(res.status).toEqual(401));
  });

  it("Return a status other than 401 if user is signed in", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({})
      .then((res) => expect(res.status).not.toEqual(401));
  });

  it("returns an error if an invalid title is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({ title: "", price: "400" })
      .then((res) => expect(res.status).toEqual(400));

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({ price: "400" })
      .then((res) => expect(res.status).toEqual(400));
  });

  it("returns an error if an invalid price is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({ title: "title", price: -10 })
      .then((res) => expect(res.status).toEqual(400));

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({ title: "title" })
      .then((res) => expect(res.status).toEqual(400));
  });

  it("creates a ticket with valid inputs", async () => {
    const tickets = await Ticket.find({});
    expect(tickets).toHaveLength(0);

    const title = "Title";
    const price = 10;

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({ title, price })
      .then((res) => {
        expect(res.status).toEqual(201);
        expect(res.body.title).toEqual(title);
        expect(res.body.price).toEqual(price);
      });
  });
});
