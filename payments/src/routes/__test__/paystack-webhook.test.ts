import request from "supertest";
import { app } from "../../app";
import crypto from "crypto";
import mongoose from "mongoose";
import { Payment, PaymentStatus } from "../../models/payment";

describe("paystack webhook", () => {
  it("updates payments status to paid", async () => {
    const reference = "tx_ref_" + crypto.randomBytes(10).toString("base64");

    await Payment.create({
      id: new mongoose.Types.ObjectId(),
      reference,
      order: new mongoose.Types.ObjectId(),
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
  });
});
