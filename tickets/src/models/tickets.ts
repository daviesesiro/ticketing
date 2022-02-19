import mongoose, { Types } from "mongoose";

interface TicetkAttrs {
  userId: string;
  title: string;
  price: number;
  orderId?: string;
  version: number;
}

const TicketScehma = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    orderId: { type: String },
  },
  {
    optimisticConcurrency: true,
    versionKey: "version",
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const Ticket = mongoose.model<TicetkAttrs>("Ticket", TicketScehma);
