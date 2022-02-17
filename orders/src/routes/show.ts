import { Request, Response, Router } from "express";

export const showRouter = Router();

showRouter.get("/api/orders/:orderId", (req: Request, res: Response) => {
  res.send({});
});
