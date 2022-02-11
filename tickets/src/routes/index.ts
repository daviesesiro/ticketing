import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";

export const indexRouter = express.Router();

indexRouter.get("/api/tickets", async (_req: Request, res: Response) => {
  const tickets = await Ticket.find();

  res.send(tickets);
});
