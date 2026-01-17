import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getQuestions,
  createAttempt,
  saveResponse
} from "../services/db.service.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const { data, error } = await getQuestions();
  if (error) return res.status(500).json(error);

  const attempt = await createAttempt(req.user.id);

  res.json({
    attemptId: attempt.id,
    questions: data
  });
});

router.post("/:attemptId/submit", auth, async (req, res) => {
  const { answers } = req.body;

  for (const ans of answers) {
    await saveResponse({
      attemptId: req.params.attemptId,
      questionId: ans.questionId,
      selectedIndex: ans.selectedIndex
    });
  }

  res.json({ success: true });
});

export default router;



