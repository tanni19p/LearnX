import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import quizRoutes from "./routes/quiz.js";
import analyticsRoutes from "./routes/analytics.js";
import resourcesRoutes from "./routes/resources.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/resources", resourcesRoutes);

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
