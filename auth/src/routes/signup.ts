import { BadRequestError, validateRequest } from "@de-ticketing/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    const user = await User.create({ email, password });

    const jsonJwt = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_KEY!,
      {}
    );
    req.session = { jwt: jsonJwt };

    res.status(201).send(user);
  }
);

export { router as signuprRouter };
