import { OrderStatus } from "@de-ticketing/common";
import mongoose from "mongoose";
import { Order } from "./order";

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  /**
   * Is this ticket reserved?
   * @descriptionw True whenever the order has successfully reserved the ticket
   * @returns boolean
   */
  isReserved(): Promise<boolean>;
}

const TicketSchema = new mongoose.Schema<TicketDoc>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  {
    // optimisticConcurrency: true,
    versionKey: "version",
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
TicketSchema.pre("save", function (done) {
  this.$where = {
    version: this.get("version") - 1,
  };

  done();
});

TicketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this._id,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Created,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

export const Ticket = mongoose.model("Ticket", TicketSchema);
