import request from "supertest";
import { app } from "../../app";

describe("Singout", () => {
  it("clears cookie after signout", async () => {
    await global.signup();

    const res = await request(app).post("/api/users/signout").expect(200);

    expect(res.get("Set-Cookie")[0]).toEqual(
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
    );
  });
});
