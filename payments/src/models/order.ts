import { OrderStatus } from "@de-ticketing/common";
import mongoose from "mongoose";

export interface OrderDoc extends mongoose.Document {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

const OrderSchema = new mongoose.Schema<OrderDoc>(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: Object.values(OrderStatus), required: true },
  },
  {
    versionKey: "version",
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrderSchema.pre("save", function (done) {
  this.$where = {
    version: this.get("version") - 1,
  };

  done();
});

export const Order = mongoose.model("Order", OrderSchema);
