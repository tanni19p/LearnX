import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { supabase } from "../services/supabase.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, name } = req.body;

  // Check if student already exists
  let { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("email", email)
    .single();

  // Create student if first login
  if (!student) {
    const newStudent = {
      id: crypto.randomUUID(),
      email,
      name
    };

    const { data } = await supabase
      .from("students")
      .insert([newStudent])
      .select()
      .single();

    student = data;
  }

  const token = jwt.sign(
    {
      id: student.id,
      email: student.email,
      role: "student"
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    user: student,
    token
  });
});

export default router;


