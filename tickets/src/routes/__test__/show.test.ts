import request from "supertest";
import { app } from "../../app";

describe("Get a ticket", () => {
  it("Return 404 if ticket is not found", async () => {
    await request(app)
      .post("/api/tickets/adasdfasdfasdf")
      .send({})
      .then((res) => expect(res.status).toEqual(404));
  });

  it("Return ticket if ticket is found", async () => {
    const title = "Title";
    const price = 10;

    const createRes = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signup())
      .send({ title, price });

    expect(createRes.status).toEqual(201);
    expect(createRes.body.title).toEqual(title);
    expect(createRes.body.price).toEqual(price);

    await request(app)
      .get("/api/tickets/" + createRes.body.id)
      .then((res) => {
        expect(res.status).not.toEqual(404);
        expect(res.body.title).toEqual(title);
        expect(res.body.price).toEqual(price);
        expect(res.body.id).toEqual(createRes.body.id);
      });
  });
});
