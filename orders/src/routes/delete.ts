import {
  currentUser,
  NotFoundError,
  OrderStatus,
  requireAuth,
  UnauthorizedError,
} from "@de-ticketing/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order";

export const deleteRouter = Router();

deleteRouter.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
  }
);
