import { Request, Response, Router } from "express";

export const deleteRouter = Router();

deleteRouter.delete("/api/orders/:orderId", (req: Request, res: Response) => {
  res.send({});
});
