// services/aiService.js
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateQuestions({ source, difficulty, numQuestions }) {
  if (openai) {
    try {
      return await generateWithAI(source, difficulty, numQuestions);
    } catch (err) {
      console.error("AI failed:", err.message, "→ fallback");
    }
  }
  return generateFallback(source, difficulty, numQuestions);
}

async function generateWithAI(source, difficulty, numQuestions) {
  const prompt = `Generate exactly ${numQuestions} multiple-choice questions about:
"""
${source}
"""

Difficulty: ${difficulty}
Return ONLY JSON:
{ "questions": [ { "text": "...", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "..." } ] }`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const parsed = JSON.parse(res.choices[0].message.content);
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error("AI returned no questions");
  }
  // Validate each question shape
  for (const q of parsed.questions) {
    if (
      !q.text ||
      !Array.isArray(q.options) ||
      q.options.length !== 4 ||
      typeof q.correctIndex !== "number" ||
      q.correctIndex < 0 ||
      q.correctIndex > 3
    ) {
      throw new Error("AI returned malformed question");
    }
  }
  return parsed.questions;
}

function generateFallback(source, difficulty, numQuestions) {
  const snippet = source.slice(0, 60).replace(/\s+/g, " ").trim() || "General knowledge";
  return Array.from({ length: numQuestions }, (_, i) => ({
    text: `(${difficulty}) Sample question ${i + 1} about: "${snippet}..." ?`,
    options: [
      `Correct answer ${i + 1}`,
      `Wrong A${i + 1}`,
      `Wrong B${i + 1}`,
      `Wrong C${i + 1}`,
    ],
    correctIndex: 0,
    explanation: `Placeholder — add OPENAI_API_KEY for real questions.`,
  }));
}