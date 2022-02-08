import mongoose from "mongoose";
import { app } from "./app";

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
