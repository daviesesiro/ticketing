import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { sign } from "jsonwebtoken";
require("dotenv/config");

let mongo: MongoMemoryServer;

jest.mock("./nats-wrapper.ts");

declare global {
  var signup: (userId?: string) => string[];
}

beforeAll(async () => {
  process.env.JWT_KEY = "a secret key";

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signup = (userId?: string) => {
  const payload = {
    id: userId ?? new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  const token = sign(payload, process.env.JWT_KEY!);
  const sessionJSON = JSON.stringify({ jwt: token });
  const base64 = Buffer.from(sessionJSON).toString("base64");

  return [`session=${base64}`];
};
