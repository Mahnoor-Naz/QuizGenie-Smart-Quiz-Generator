# Prompt Log – QuizGenie (Database and Quiz Management)

**Member:** [Anfal]

| # | Prompt (short) | What AI gave | What was wrong | How we fixed it | Member |
|---|---|---|---|---|---|
| 1 | Review `schema.sql` and `db.js` for a SQLite database managing quizzes, questions, and attempts. | SQLite schema with 3 tables, Foreign Keys, and `ON DELETE CASCADE`. | Nothing wrong. The schema is perfectly normalized. | No fix needed. Verified that deleting a quiz automatically deletes its questions and attempts. | [Aapka Naam] |
| 2 | Write the `createQuiz` function in `quizModel.js` to insert a quiz and its multiple questions. | A basic function that loops through questions and runs an `INSERT` query for each. | **Non-trivial problem:** If an error occurred halfway through inserting questions, the database would be left with a half-saved quiz (orphan data). | Used `db.transaction()` from `better-sqlite3`. Now, either all questions are saved, or none are (atomicity). | [Aapka Naam] |
| 3 | Review `validate.js` and `quizRoutes.js` for input validation. | Validation for topic, difficulty, and numQuestions. | **Non-trivial problem:** If a user uploaded a PDF, the `topic` field was empty. The validator threw an error, blocking valid PDF uploads. | Added `!req.file` check in the `topic` validation block. | [Aapka Naam] |
| 4 | Review `evaluationService.js` for calculating quiz scores. | A function that maps submitted answers and calculates the percentage. | **Non-trivial problem:** If a malicious user sent fewer answers than the total questions, the backend accepted it and saved a fake score. | Added a strict check: `submittedAnswers.length !== questions.length` throws a 400 error. | [Aapka Naam] |
| 5 | How to prevent SQL Injection in the `quizModel.js` queries. | Use parameterized queries (`?` placeholders). | Nothing wrong. | Confirmed all queries use `db.prepare(...).run()` with `?`. | [Aapka Naam] |

## Problems Found and Fixed in AI-Generated Code (Database & Quiz Management)

### Problem 1: Partial Quiz Saving (Transaction Issue)

**File:** `backend/models/quizModel.js`

**What was wrong:**
The AI-generated code inserted the quiz first, then looped through the questions. If an error occurred during the loop (e.g., a database error or a missing field), the quiz remained in the database without its questions. This created orphan data.

**Why it was a serious problem:**
- The database could contain incomplete quizzes.
- The frontend would show a quiz with missing questions, which confuses the user.
- There was no way to recover the missing data.

**How I fixed it:**
I used `db.transaction()` from `better-sqlite3`. Now, either the entire quiz is saved successfully, or nothing is saved. This ensures data integrity.

```javascript
const tx = db.transaction(() => {
  const info = insertQuiz.run(title, topic, difficulty, numQuestions, createdAt);
  const quizId = info.lastInsertRowid;
  for (const q of questions) {
    insertQuestion.run(quizId, q.text, JSON.stringify(q.options), q.correctIndex, q.explanation || "");
  }
  return quizId;
});