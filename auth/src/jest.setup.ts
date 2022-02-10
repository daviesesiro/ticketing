import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "./app";
import request from "supertest";

let mongo: MongoMemoryServer;

// jest.setTimeout(20000);

declare global {
  var signup: () => Promise<string[]>;
}

beforeAll(async () => {
  process.env.JWT_KEY = "asdfadsfasd";
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signup = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};
