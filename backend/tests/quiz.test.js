
// backend/tests/quiz.test.js

import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import express from "express";

// Test environment configuration
process.env.API_KEY = "quizgenie-test-key";
process.env.AI_FALLBACK = "true";
process.env.OPENAI_API_KEY = "";
process.env.AI_MODEL = "";

// Import actual project routes after setting environment variables
const { default: quizRoutes } = await import("../routes/quizRoutes.js");
const { notFound, errorHandler } = await import(
  "../middleware/errorHandler.js"
);
const { default: db } = await import("../config/db.js");

// Build test application using actual QuizGenie routes and middleware
const app = express();

app.use(express.json());
app.use("/api/quizzes", quizRoutes);
app.use(notFound);
app.use(errorHandler);

let server;
let baseURL;
let quizId;
let savedAttemptId;

const API_KEY = "quizgenie-test-key";

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

// Helper function for API requests
async function request(endpoint, options = {}) {
  return fetch(`${baseURL}${endpoint}`, options);
}

// Start test server
before(async () => {
  server = app.listen(0, "127.0.0.1");

  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();
  baseURL = `http://127.0.0.1:${address.port}`;
});

// Clean up test quiz and close server
after(async () => {
  if (quizId) {
    await request(`/api/quizzes/${quizId}`, {
      method: "DELETE",
      headers,
    });
  }

  await new Promise((resolve) => server.close(resolve));
});

// =====================================================
// QUIZGENIE AUTOMATED TEST CASES
// =====================================================

test("QuizGenie - Automated API Testing", async (t) => {

  // TC-01: Unauthorized quiz creation
  await t.test("TC-01 - Reject quiz creation without API key", async () => {
    const response = await request("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: "Software Engineering",
        difficulty: "Easy",
        numQuestions: 5,
      }),
    });

    const data = await response.json();

    assert.equal(response.status, 401);
    assert.equal(data.error, "Unauthorized: invalid API key");
  });

  // TC-02: Missing topic and PDF
  await t.test("TC-02 - Reject quiz without topic or PDF", async () => {
    const response = await request("/api/quizzes", {
      method: "POST",
      headers,
      body: JSON.stringify({
        difficulty: "Easy",
        numQuestions: 5,
      }),
    });

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.equal(
      data.error,
      "Please provide a topic or a PDF file"
    );
  });

  // TC-03: Invalid difficulty
  await t.test("TC-03 - Reject invalid difficulty", async () => {
    const response = await request("/api/quizzes", {
      method: "POST",
      headers,
      body: JSON.stringify({
        topic: "Software Engineering",
        difficulty: "Very Hard",
        numQuestions: 5,
      }),
    });

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.equal(
      data.error,
      "difficulty must be Easy, Medium or Hard"
    );
  });

  // TC-04: Invalid number of questions
  await t.test("TC-04 - Reject unsupported question count", async () => {
    const response = await request("/api/quizzes", {
      method: "POST",
      headers,
      body: JSON.stringify({
        topic: "Software Engineering",
        difficulty: "Easy",
        numQuestions: 7,
      }),
    });

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.equal(
      data.error,
      "numQuestions must be 5, 10 or 15"
    );
  });

  // TC-05: Successfully create a quiz
  await t.test("TC-05 - Create quiz successfully", async () => {
    const response = await request("/api/quizzes", {
      method: "POST",
      headers,
      body: JSON.stringify({
        topic: "Software Engineering",
        difficulty: "Easy",
        numQuestions: 5,
      }),
    });

    const data = await response.json();

    assert.equal(response.status, 201);
    assert.ok(data.id);
    assert.equal(data.title, "Software Engineering");
    assert.equal(data.difficulty, "Easy");
    assert.equal(data.numQuestions, 5);
    assert.equal(data.questions.length, 5);

    quizId = data.id;

    for (const question of data.questions) {
      assert.ok(question.text);
      assert.equal(question.options.length, 4);
      assert.ok(!("correctIndex" in question));
    }
  });

  // TC-06: Retrieve quiz and quiz list
  await t.test("TC-06 - Retrieve quiz details and quiz list", async () => {
    const detailsResponse = await request(
      `/api/quizzes/${quizId}`
    );

    const details = await detailsResponse.json();

    assert.equal(detailsResponse.status, 200);
    assert.equal(details.id, quizId);
    assert.equal(details.questions.length, 5);

    const listResponse = await request("/api/quizzes");
    const quizzes = await listResponse.json();

    assert.equal(listResponse.status, 200);
    assert.ok(Array.isArray(quizzes));
    assert.ok(quizzes.some((quiz) => quiz.id === quizId));
  });

  // TC-07: Invalid quiz ID
  await t.test("TC-07 - Reject invalid quiz ID", async () => {
    const response = await request("/api/quizzes/abc");
    const data = await response.json();

    assert.equal(response.status, 400);
    assert.equal(data.error, "Invalid quiz id");
  });

  // TC-08: Invalid attempt submission
  await t.test("TC-08 - Reject empty answer submission", async () => {
    const response = await request(
      `/api/quizzes/${quizId}/attempts`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: [] }),
      }
    );

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.equal(
      data.error,
      "answers must be a non-empty array"
    );
  });

  // Get actual correct answers from the project database.
  // The public quiz API intentionally does not return correctIndex.
  const questions = db.prepare(
    `SELECT id, correctIndex FROM questions WHERE quizId = ?`
  ).all(quizId);

  // TC-09: Correct quiz evaluation
  await t.test("TC-09 - Evaluate all correct answers", async () => {
    const answers = questions.map((question) => ({
      questionId: question.id,
      selectedIndex: question.correctIndex,
    }));

    const response = await request(
      `/api/quizzes/${quizId}/attempts`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ answers }),
      }
    );

    const result = await response.json();

    assert.equal(response.status, 200);
    assert.equal(result.score, 5);
    assert.equal(result.total, 5);
    assert.equal(result.percentage, 100);
    assert.equal(result.results.length, 5);
    assert.ok(result.results.every((r) => r.isCorrect));
    assert.ok(result.attemptId);

    savedAttemptId = result.attemptId;

    // Verify that the attempt was actually saved in SQLite.
    const savedAttempt = db.prepare(
      "SELECT * FROM attempts WHERE id = ?"
    ).get(savedAttemptId);

    assert.ok(savedAttempt);
    assert.equal(savedAttempt.quizId, quizId);
    assert.equal(savedAttempt.score, 5);
    assert.equal(savedAttempt.percentage, 100);
  });

  // TC-10: Incorrect quiz evaluation
  await t.test("TC-10 - Evaluate incorrect answers", async () => {
    const answers = questions.map((question) => ({
      questionId: question.id,
      selectedIndex: (question.correctIndex + 1) % 4,
    }));

    const response = await request(
      `/api/quizzes/${quizId}/attempts`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ answers }),
      }
    );

    const result = await response.json();

    assert.equal(response.status, 200);
    assert.equal(result.score, 0);
    assert.equal(result.total, 5);
    assert.equal(result.percentage, 0);
    assert.ok(result.results.every((r) => !r.isCorrect));
  });

  // TC-11: Partial answer evaluation
  await t.test("TC-11 - Evaluate partially answered quiz", async () => {
    const answers = [
      {
        questionId: questions[0].id,
        selectedIndex: questions[0].correctIndex,
      },
    ];

    const response = await request(
      `/api/quizzes/${quizId}/attempts`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ answers }),
      }
    );

    const result = await response.json();

    assert.equal(response.status, 200);
    assert.equal(result.score, 1);
    assert.equal(result.total, 5);
    assert.equal(result.percentage, 20);
    assert.equal(result.results.length, 5);

    const unanswered = result.results.filter(
      (r) => r.selectedIndex === null
    );

    assert.equal(unanswered.length, 4);
  });

  // TC-12: Invalid selected answer index
  await t.test("TC-12 - Reject answer index outside valid range", async () => {
    const response = await request(
      `/api/quizzes/${quizId}/attempts`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          answers: [
            {
              questionId: questions[0].id,
              selectedIndex: 5,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.equal(
      data.error,
      "Each answer needs questionId and selectedIndex (0-3)"
    );
  });

  // TC-13: Rename quiz successfully
  await t.test("TC-13 - Rename existing quiz", async () => {
    const response = await request(
      `/api/quizzes/${quizId}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: "Updated Software Engineering Quiz",
        }),
      }
    );

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(
      data.title,
      "Updated Software Engineering Quiz"
    );
  });

  // TC-14: Reject empty quiz title
  await t.test("TC-14 - Reject empty quiz title", async () => {
    const response = await request(
      `/api/quizzes/${quizId}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({ title: "   " }),
      }
    );

    const data = await response.json();

    assert.equal(response.status, 400);
    assert.equal(data.error, "Title is required");
  });

  // TC-15: Quiz not found
  await t.test("TC-15 - Return 404 for nonexistent quiz", async () => {
    const response = await request("/api/quizzes/999999");

    const data = await response.json();

    assert.equal(response.status, 404);
    assert.equal(data.error, "Quiz not found");
  });

  // TC-16: Delete quiz and verify database integration
  await t.test("TC-16 - Delete quiz and verify database cleanup", async () => {
    const response = await request(
      `/api/quizzes/${quizId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    assert.equal(response.status, 204);

    // Verify quiz is deleted.
    const deletedQuiz = db.prepare(
      "SELECT * FROM quizzes WHERE id = ?"
    ).get(quizId);

    assert.equal(deletedQuiz, undefined);

    // Verify related questions are deleted.
    const remainingQuestions = db.prepare(
      "SELECT * FROM questions WHERE quizId = ?"
    ).all(quizId);

    assert.equal(remainingQuestions.length, 0);

    // Verify related attempts are deleted through foreign-key cascade.
    const remainingAttempts = db.prepare(
      "SELECT * FROM attempts WHERE quizId = ?"
    ).all(quizId);

    assert.equal(remainingAttempts.length, 0);

    // Verify API returns 404 after deletion.
    const getResponse = await request(
      `/api/quizzes/${quizId}`
    );

    assert.equal(getResponse.status, 404);

    // Prevent cleanup from attempting to delete it again.
    quizId = null;
  });

});
