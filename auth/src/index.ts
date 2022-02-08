import express from "express";
import "express-async-errors";
import mongoose from "mongoose";

import { NotFoundError } from "./errors/notfound-error";
import { errorHandler } from "./middlewares/error-handler";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signuprRouter } from "./routes/signup";
import cookieSession from "cookie-session";

const app = express();
app.use(express.json());
app.set("trust proxy", true);
app.use(cookieSession({ signed: false, secure: true }));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signuprRouter);
app.use(signoutRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not found");
  }
  mongoose
    .connect("mongodb://auth-mongo-srv:27017/auth")
    .then(() => console.log("connected to mongodb"))
    .catch((err) => console.log("db error: %o", err));
};

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
start();
