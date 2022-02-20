import request from "supertest";
import { app } from "../../app";
import crypto from "crypto";
import mongoose from "mongoose";
import { Payment, PaymentStatus } from "../../models/payment";
import { OrderStatus } from "@de-ticketing/common";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

describe("paystack webhook", () => {
  it("updates payments status to paid", async () => {
    const reference = "tx_ref_" + crypto.randomBytes(10).toString("base64");
    const order = await Order.create({
      id: new mongoose.Types.ObjectId(),
      status: OrderStatus.Created,
      version: 0,
      userId: "adsfasfasdf",
      price: 20,
    });

    await Payment.create({
      id: new mongoose.Types.ObjectId(),
      reference,
      order: order.id,
      status: PaymentStatus.Awaiting,
    });

    const event = {
      event: "charge.success",
      data: {
        id: 302961,
        status: "success",
        reference,
        amount: 10000,
        currency: "NGN",
      },
    };

    var hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_KEY!)
      .update(JSON.stringify(event))
      .digest("hex");

    await request(app)
      .post("/api/payments/webhook/paystack")
      .set({ "x-paystack-signature": hash })
      .send(event)
      .expect(200);

    const updatedPayment = await Payment.findOne({ reference });

    expect(updatedPayment!.status).toEqual(PaymentStatus.paid);

    // ensure payment created was published
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
