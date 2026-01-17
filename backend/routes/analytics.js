import express from "express";
import { auth } from "../middleware/auth.js";
import { getConceptPerformance } from "../services/db.service.js";

const router = express.Router();

router.get("/my-gaps", auth, async (req, res) => {
  const { data, error } = await getConceptPerformance(req.user.id);
  if (error) return res.status(500).json(error);

  res.json(data);
});

export default router;


