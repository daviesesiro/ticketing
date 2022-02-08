import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res, next) => {
  req.session = null;

  res.status(200).end();
});

export { router as signoutRouter };
