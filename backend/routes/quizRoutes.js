// routes/quizRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { requireApiKey } from "../middleware/auth.js";
import {
  validateCreateQuiz,
  validateRename,
  validateIdParam,
  validateAttempt,
} from "../middleware/validate.js";

import {
  listQuizzes,
  getQuizById,
  getQuizWithAnswers,
  createQuiz,
  renameQuiz,
  deleteQuiz,
  saveAttempt,
} from "../models/quizModel.js";

import { extractTextFromPdf } from "../services/pdfService.js";
import { generateQuestions } from "../services/aiService.js";
import { evaluateAnswers } from "../services/evaluationService.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ============ PUBLIC READ (no auth needed for GET) ============

router.get("/", (req, res) => {
  res.json(listQuizzes());
});

router.get("/:id", validateIdParam, (req, res) => {
  const quiz = getQuizById(req.params.id);
  if (!quiz) return res.status(404).json({ error: "Quiz not found" });
  res.json(quiz);
});

// ============ PROTECTED (need API key) ============

router.post(
  "/",
  requireApiKey,
  upload.single("file"),
  validateCreateQuiz,
  wrap(async (req, res) => {
    try {
      const { topic, difficulty, numQuestions } = req.body;
      const file = req.file;

      let source = "";
      let title = "";

      if (file) {
        source = await extractTextFromPdf(file.path);
        title = file.originalname.replace(/\.pdf$/i, "");
      } else {
        source = topic.trim();
        title = topic.trim();
      }

      const generated = await generateQuestions({
        source,
        difficulty,
        numQuestions: Number(numQuestions),
      });

      const quiz = createQuiz({
        title,
        topic: topic?.trim() || title,
        difficulty,
        numQuestions: Number(numQuestions),
        questions: generated,
      });

      res.status(201).json(quiz);
    } finally {
      if (req.file) fs.unlink(req.file.path, () => {});
    }
  })
);

router.put("/:id", requireApiKey, validateIdParam, validateRename, (req, res) => {
  const updated = renameQuiz(req.params.id, req.body.title.trim());
  if (!updated) return res.status(404).json({ error: "Quiz not found" });
  res.json(updated);
});

router.delete("/:id", requireApiKey, validateIdParam, (req, res) => {
  const ok = deleteQuiz(req.params.id);
  if (!ok) return res.status(404).json({ error: "Quiz not found" });
  res.status(204).end();
});

// ============ SUBMIT ATTEMPT ============

router.post(
  "/:id/attempts",
  validateIdParam,
  validateAttempt,
  (req, res) => {
    const quiz = getQuizWithAnswers(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const result = evaluateAnswers(quiz.questions, req.body.answers);
    const attemptId = saveAttempt({
      quizId: quiz.id,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      answers: req.body.answers,
    });
    res.json({ attemptId, ...result });
  }
);

export default router;