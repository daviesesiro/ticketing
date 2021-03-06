import { NotFoundError, errorHandler } from "@de-ticketing/common";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signuprRouter } from "./routes/signup";

export const app = express();

app.use(express.json());
app.set("trust proxy", true);
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signuprRouter);
app.use(signoutRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);
