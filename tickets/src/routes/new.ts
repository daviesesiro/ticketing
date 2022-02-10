import { currentUser, requireAuth } from "@de-ticketing/common";
import express, { Request, Response } from "express";

export const createRouter = express.Router();

createRouter.post(
  "/api/tickets",
  requireAuth,
  (req: Request, res: Response) => {
    console.log(req.session);
    res.sendStatus(200);
  }
);
