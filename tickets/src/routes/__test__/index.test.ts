import request from "supertest";
import { app } from "../../app";

export const createTicket = () =>
  request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({ title: "title 1", price: 10 });

describe("Get tickets", () => {
  it("Can fetch a list of tickets", async () => {
    await createTicket().expect(201);
    await createTicket().expect(201);
    await createTicket().expect(201);

    await request(app)
      .get("/api/tickets")
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body).toHaveLength(3);
      });
  });
});
