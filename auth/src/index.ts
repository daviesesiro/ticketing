import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("starting up.......");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not found");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not found");
  }
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("connected to auth mongodb"))
    .catch((err) => console.log("db error: %o", err));
};

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

start();
