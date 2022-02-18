import {
  currentUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
  validateRequest,
} from "@de-ticketing/common";
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../models/tickets";
import { natsWrapper } from "../nats-wrapper";

export const updateRouter = express.Router();

updateRouter.put(
  "/api/tickets/:id",
  [
    param("id").isString().isMongoId(),
    body("title").notEmpty().withMessage("Title is required").isString(),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    let ticket = await Ticket.findById(id);

    if (!ticket) throw new NotFoundError();
    if (ticket.userId !== req.currentUser!.id) throw new UnauthorizedError();

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    ticket = await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);
