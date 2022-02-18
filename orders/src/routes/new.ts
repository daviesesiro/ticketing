import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@de-ticketing/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";

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
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) throw new NotFoundError();

    const isReserved = await ticket.isReserved();

    if (isReserved)
      throw new BadRequestError("Ticket has already been reserved");

    const exp = new Date();
    exp.setSeconds(exp.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = await Order.create({
      userId: req.currentUser!.id,
      expiresAt: exp,
      status: OrderStatus.Created,
      ticket,
    });

    new OrderCreatedPublisher(natsWrapper.client).publish({
      expiresAt: exp.toISOString(),
      id: order.id,
      status: order.status,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
      userId: req.currentUser!.id,
    });

    res.status(201).send(order);
  }
);
