import {
  currentUser,
  requireAuth,
  validateRequest,
} from "@de-ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";

export const createRouter = express.Router();

createRouter.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required").isString(),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.create({
      title,
      price,
      userId: req.currentUser?.id,
    });

    res.status(201).send(ticket);
  }
);
