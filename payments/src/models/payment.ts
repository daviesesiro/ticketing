import mongoose from "mongoose";
import { OrderDoc } from "./order";

interface PaymentDoc extends mongoose.Document {
  id: string;
  order: OrderDoc;
  reference: string;
  status: string;
}

export enum PaymentStatus {
  Awaiting = "awaiting",
  failed = "failed",
  paid = "paid",
}

const paymentSchema = new mongoose.Schema<PaymentDoc>(
  {
    reference: { type: String, required: true, unique: true },
    status: {
      type: String,
      default: PaymentStatus.Awaiting,
      enum: Object.values(PaymentStatus),
    },
    order: {
      ref: "Order",
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export const Payment = mongoose.model("Payment", paymentSchema);
