import { app } from "../../app";
import request from "supertest";

describe("Current user", () => {
  it("get current user", async () => {
    const cookie = await global.signup();

    const res = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.currentUser.email).toEqual("test@test.com");
  });

  it("respond with null when not authenticated", async () => {
    const res = await request(app).get("/api/users/currentuser").expect(200);

    expect(res.body.currentUser).toBeNull();
  });
});
