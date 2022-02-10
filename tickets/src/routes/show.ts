import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@de-ticketing/common";
import express, { Request, Response } from "express";
import { param } from "express-validator";
import { Ticket } from "../models/tickets";

export const showRouter = express.Router();

showRouter.get(
  "/api/tickets/:id",
  [param("id").isMongoId()],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();

    res.status(201).send(ticket);
  }
);
