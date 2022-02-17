import {
  currentUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@de-ticketing/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order";

export const showRouter = Router();

showRouter.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();

    res.send(order);
  }
);
