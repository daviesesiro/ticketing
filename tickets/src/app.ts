import { NotFoundError, errorHandler } from "@de-ticketing/common";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";

export const app = express();

app.use(express.json());
app.set("trust proxy", true);
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.all("*", async () => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);
