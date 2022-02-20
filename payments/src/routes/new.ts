import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  UnauthorizedError,
  validateRequest,
} from "@de-ticketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { paystackApi } from "../service/paystack";

export const createRouter = Router();

createRouter.post(
  "/api/payments",
  requireAuth,
  [body("orderId").notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Cannot pay for a cancelled order");

    const response = await paystackApi.initializePayment(
      email,
      order.price * 100
    );

    await Payment.create({ reference: response?.data.reference, order });

    res.send({
      paymentUrl: response.data.authorization_url,
      reference: response?.data.reference,
    });
  }
);
