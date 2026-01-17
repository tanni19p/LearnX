import { supabase } from "./supabase.js";

export async function getQuestions() {
  return supabase
    .from("questions")
    .select("id, question, options, concept");
}

export async function createAttempt(studentId) {
  return supabase
    .from("attempts")
    .insert([{ student_id: studentId }])
    .select()
    .single();
}

export async function saveResponse({ attemptId, questionId, selectedIndex }) {
  return supabase
    .from("responses")
    .insert([
      {
        attempt_id: attemptId,
        question_id: questionId,
        selected_index: selectedIndex
      }
    ]);
}

export async function getConceptPerformance(studentId) {
  return supabase
    .rpc("concept_accuracy", { sid: studentId });
}
