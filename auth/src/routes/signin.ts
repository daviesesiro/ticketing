import { validateRequest, BadRequestError } from "@de-ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new BadRequestError("Invalid credentials");

    if (!(await Password.compare(existingUser.password, password)))
      throw new BadRequestError("Invalid credentials");

    const jsonJwt = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_KEY!,
      {}
    );
    req.session = { jwt: jsonJwt };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
