import { currentUser, requireAuth } from "@de-ticketing/common";
import { Request, Response, Router } from "express";
import { Order } from "../models/order";

export const indexRouter = Router();

indexRouter.get(
  "/api/orders",
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      "ticket"
    );

    res.send(orders);
  }
);
