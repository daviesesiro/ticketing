import { OrderStatus } from "@de-ticketing/common";
import mongoose from "mongoose";
import { TicketDoc } from "./ticket";

interface OrderDocs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;

  version: number;
}

const orderSchema = new mongoose.Schema<OrderDocs>(
  {
    userId: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: { type: mongoose.Schema.Types.Date },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
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

export const Order = mongoose.model<OrderDocs>("Order", orderSchema);
