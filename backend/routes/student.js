import express from "express";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

export default router;
