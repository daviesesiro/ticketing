import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  UnauthorizedError,
} from "@de-ticketing/common";
import { Request, Response, Router } from "express";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";

export const deleteRouter = Router();

deleteRouter.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate({
      path: "ticket",
      select: "id",
    });

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);