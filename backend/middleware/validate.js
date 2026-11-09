// middleware/validate.js
// Har route ke input ko check karta hai.

export function validateCreateQuiz(req, res, next) {
  const { topic, difficulty, numQuestions } = req.body;

  // Topic ya file — kam se kam ek hona chahiye
  if (!topic && !req.file) {
    return res.status(400).json({ error: "Please provide a topic or a PDF file" });
  }

  // Topic diya hai to 3+ chars
  if (topic !== undefined) {
    if (typeof topic !== "string" || topic.trim().length < 3) {
      return res.status(400).json({ error: "Topic must be at least 3 characters" });
    }
    if (topic.length > 200) {
      return res.status(400).json({ error: "Topic is too long (max 200)" });
    }
  }

  // Difficulty whitelist
  if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
    return res.status(400).json({ error: "difficulty must be Easy, Medium or Hard" });
  }

  // numQuestions whitelist
  const count = Number(numQuestions);
  if (![5, 10, 15].includes(count)) {
    return res.status(400).json({ error: "numQuestions must be 5, 10 or 15" });
  }

  next();
}

export function validateRename(req, res, next) {
  const { title } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  if (title.trim().length > 200) {
    return res.status(400).json({ error: "Title is too long (max 200)" });
  }
  next();
}

export function validateIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid quiz id" });
  }
  next();
}

export function validateAttempt(req, res, next) {
  const { answers } = req.body;
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "answers must be a non-empty array" });
  }
  for (const a of answers) {
    if (
      typeof a.questionId !== "number" ||
      typeof a.selectedIndex !== "number" ||
      a.selectedIndex < 0 ||
      a.selectedIndex > 3
    ) {
      return res.status(400).json({ error: "Each answer needs questionId and selectedIndex (0-3)" });
    }
  }
  next();
}