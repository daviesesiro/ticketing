import { Request, Response, Router } from "express";
import crypto from "crypto";
import { Payment, PaymentStatus } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publisehers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { Order } from "../models/order";
export const paystackWebhookRouter = Router();

paystackWebhookRouter.post(
  "/api/payments/webhook/paystack",
  async (req: Request, res: Response) => {
    const { valid, body } = validateEvent(req);

    if (!valid) {
      return res.sendStatus(200);
    }

    const { event, data } = body;
    if (event === "charge.success") {
      const payment = await Payment.findOne({
        reference: data.reference,
      }).populate("order");

      if (payment) {
        await payment.set({ status: PaymentStatus.paid }).save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
          orderId: payment.order.id,
          id: payment.id,
          reference: payment.reference,
        });
      }
    }

    res.sendStatus(200);
  }
);

const validateEvent = (req: Request) => {
  var hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_KEY!)
    .update(JSON.stringify(req.body))
    .digest("hex");

  return {
    valid: hash === req.headers["x-paystack-signature"],
    body: req.body,
  };
};
