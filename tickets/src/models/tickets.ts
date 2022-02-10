import mongoose, { Types } from "mongoose";

interface TicetkAttrs {
  userId: string;
  title: string;
  price: number;
}

const userScehma = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Ticket = mongoose.model<TicetkAttrs>("User", userScehma);
