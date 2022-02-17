import {
  BadRequestError,
  currentUser,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@de-ticketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

export const createRouter = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15mins

createRouter.post(
  "/api/orders",
  [
    body("ticketId")
      .notEmpty()
      .withMessage("ticketId must be provided")
      .isMongoId(),
  ],
  validateRequest,
  requireAuth,
  currentUser,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.ticketId as string);

    if (!ticket) throw new BadRequestError("Ticket not found");

    const isReserved = await ticket.isReserved();

    if (isReserved)
      throw new BadRequestError("Ticket has already been reserved");

    const exp = new Date();
    exp.setSeconds(exp.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.create({
      userId: req.currentUser!,
      expiresAt: exp,
      status: OrderStatus.Created,
      ticket,
    });

    res.status(201).send(ticket);
  }
);
