import { OrderStatus } from "@de-ticketing/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment, PaymentStatus } from "../../models/payment";

describe("create payment route", () => {
  it("returns a 404 when purchasing an order that does not exist", async () => {
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signup())
      .send({ orderId: new mongoose.Types.ObjectId(), email: "test@test.com" })
      .expect(404);
  });

  it("returns a 401 when purchasing that does not belong to user", async () => {
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      status: OrderStatus.Created,
      version: 0,
    });

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signup())
      .send({ orderId: order.id, email: "test@test.com" })
      .expect(401);
  });

  it("returns a 400 when purchasing a cancelled order", async () => {
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      status: OrderStatus.Cancelled,
      version: 0,
    });

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signup(order.userId))
      .send({ orderId: order.id, email: "test@test.com" })
      .expect(400);
  });

  it("initial order payment", async () => {
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      status: OrderStatus.Created,
      version: 0,
    });

    const res = await request(app)
      .post("/api/payments")
      .set("Cookie", global.signup(order.userId))
      .send({ orderId: order.id, email: "test@test.com" })
      .expect(200);

    expect(res.body.paymentUrl).toBeDefined();
    expect(res.body.reference).toBeDefined();

    // check if the payments was saved
    const payment = await Payment.findOne({
      reference: res.body.reference,
    }).populate("order");

    expect(payment!.order.id).toEqual(order.id);
    expect(payment!.status).toEqual(PaymentStatus.Awaiting);
  });
});
