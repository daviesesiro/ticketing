import { NotFoundError, errorHandler, currentUser } from "@de-ticketing/common";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { indexRouter } from "./routes";
import { deleteRouter } from "./routes/delete";
import { createRouter } from "./routes/new";
import { showRouter } from "./routes/show";

export const app = express();

app.use(express.json());
app.set("trust proxy", true);
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);
app.use(currentUser);

app.use(createRouter);
app.use(showRouter);
app.use(indexRouter);
app.use(deleteRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// error handler
app.use(errorHandler);
