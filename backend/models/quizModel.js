// models/quizModel.js
// Saari DB queries parameterized hain (?) — SQL injection safe.

import db from "../config/db.js";

// ---------- QUIZZES ----------

export function listQuizzes() {
  return db.prepare("SELECT * FROM quizzes ORDER BY createdAt DESC").all();
}

export function getQuizById(id) {
  const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(id);
  if (!quiz) return null;

  const questions = db
    .prepare("SELECT id, text, options FROM questions WHERE quizId = ?")
    .all(id)
    .map((q) => ({ ...q, options: JSON.parse(q.options) }));

  return { ...quiz, questions };
}

export function getQuizWithAnswers(id) {
  const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(id);
  if (!quiz) return null;

  const questions = db
    .prepare(
      "SELECT id, text, options, correctIndex, explanation FROM questions WHERE quizId = ?"
    )
    .all(id)
    .map((q) => ({ ...q, options: JSON.parse(q.options) }));

  return { ...quiz, questions };
}

export function createQuiz({ title, topic, difficulty, numQuestions, questions }) {
  const createdAt = new Date().toISOString();

  const insertQuiz = db.prepare(
    `INSERT INTO quizzes (title, topic, difficulty, numQuestions, createdAt)
     VALUES (?, ?, ?, ?, ?)`
  );
  const insertQuestion = db.prepare(
    `INSERT INTO questions (quizId, text, options, correctIndex, explanation)
     VALUES (?, ?, ?, ?, ?)`
  );

  const tx = db.transaction(() => {
    const info = insertQuiz.run(title, topic, difficulty, numQuestions, createdAt);
    const quizId = info.lastInsertRowid;
    for (const q of questions) {
      insertQuestion.run(
        quizId,
        q.text,
        JSON.stringify(q.options),
        q.correctIndex,
        q.explanation || ""
      );
    }
    return quizId;
  });

  const quizId = tx();
  return getQuizById(quizId);
}

export function renameQuiz(id, title) {
  const info = db.prepare("UPDATE quizzes SET title = ? WHERE id = ?").run(title, id);
  if (info.changes === 0) return null;
  return db.prepare("SELECT * FROM quizzes WHERE id = ?").get(id);
}

export function deleteQuiz(id) {
  const info = db.prepare("DELETE FROM quizzes WHERE id = ?").run(id);
  return info.changes > 0;
}

// ---------- ATTEMPTS ----------

export function saveAttempt({ quizId, score, total, percentage, answers }) {
  const createdAt = new Date().toISOString();
  const info = db
    .prepare(
      `INSERT INTO attempts (quizId, score, total, percentage, answers, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(quizId, score, total, percentage, JSON.stringify(answers), createdAt);
  return Number(info.lastInsertRowid);
}