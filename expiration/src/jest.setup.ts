import { sign } from "jsonwebtoken";

jest.mock("./nats-wrapper.ts");

beforeAll(async () => {});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {});
