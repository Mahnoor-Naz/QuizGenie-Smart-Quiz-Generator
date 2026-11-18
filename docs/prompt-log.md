# QuizGenie – Complete AI Prompt Log and Code Review Report

## 1. Prompt Log – QuizGenie (Frontend)

**Member: Mahnoor**

| # | Prompt (Short) | What AI Provided | What Was Wrong | How We Fixed It |
|---|---|---|---|---|
| 1 | Generate a README for QuizGenie with its description, features, tech stack, API endpoints, setup, usage, team, and GitHub collaboration details. | A complete README file in Markdown. | Some details were left as placeholders, including the clone URL, team names, database name, and start command. | Added my own name. The remaining project-specific details will be completed before final submission. |
| 2 | Create `src/mock/mockQuiz.js` with `mockQuizList`, `mockQuiz` (without correct answers), and `mockAttemptResult` (4/5 correct), using the exact field names. | A mock data file with three named exports. | No issues were found. | Checked the field names against our API contract and manually verified the answers. No changes were needed. |
| 3 | How can I test the mock data file from the terminal without creating another file? | Node.js commands to check exports, field values, hidden answers, and scores. | No issues were found. | Ran all eight checks, and they returned `true`. |
| 4 | Set up routing for three screens using `react-router-dom` 7.18.5. | `main.jsx`, `App.jsx`, and three placeholder pages. | No issues were found. | Used the correct React Router v7 syntax with `Routes` and `element`. Tested `/`, `/quiz/1`, `/results`, and `/abc` in the browser. |
| 5 | Create a `quizApi.js` service file with CRUD functions, a mock on/off switch, loading delay, and error handling. | A service file with six functions using either mock data or Axios. | Two API contract mismatches were found: errors were read from `message` instead of `error`, and the PDF field was named `pdf` instead of `file`. | Changed the error handling to `data?.error` and updated the form field to `formData.get("file")`. |
| 6 | How can I test all `quizApi.js` functions from the terminal without creating a new file? | Node.js commands covering CRUD functions, quiz submission, empty form errors, and invalid IDs. | The suggested commands were supposed to run from the main project folder, but the `src` folder was inside `frontend`. | Ran the commands from the `frontend` directory. All eight checks passed. Evidence: `quizapi-test.png`. |
| 7 | Create a quiz generator form in React where users can enter a topic or upload a PDF, select difficulty and question count, and generate a quiz. | `QuizForm.jsx`, `QuizForm.css`, and an updated Home page. | The PDF was sent using `pdf` instead of the required `file` field. There was no file size limit, error messages were not announced to screen readers, tabs lacked proper accessibility information, keyboard focus was unclear, and mobile responsiveness needed improvement. | Kept the original version for comparison and created a more detailed prompt to address these issues. |
| 8 | Rebuild the QuizForm with clear requirements for data handling, validation, accessibility, responsiveness, and state management. | Updated `QuizForm.jsx` and `QuizForm.css`. | AI suggested changing `formData.get("pdf")` to `formData.get("file")` in `quizApi.js`, but that correction had already been made earlier. | Ignored the outdated suggestion and used the updated form and CSS. Tested the form on desktop and mobile. |
| 9 | Add a saved quiz list below the QuizForm with Start, Rename, and Delete options, including loading, empty, and error states. | `SavedQuizList.jsx`, `SavedQuizList.css`, and an updated `Home.jsx`. | No major issues were found. Renamed and deleted quizzes return after refreshing because mock data is not permanently stored. | Tested loading, empty states, rename, delete confirmation, cancel, Start button, and mobile layout. The in-card confirmation also worked better for keyboard and screen-reader users than a browser pop-up. Evidence: `home-mobile.png`, `home-delete-confirm.png`. |
| 10 | Create the Attempt Quiz and Results screens with a professional light theme, question navigation, answer selection, scoring, and mobile support. | `index.css`, `App.css`, `QuestionCard.jsx`, `QuestionCard.css`, `AttemptQuiz.jsx`, `AttemptQuiz.css`, `Results.jsx`, and `Results.css`. | The new code worked correctly. However, I noticed that `App.jsx` was not importing `App.css`, so the header styles from that file would not be applied. Mock mode also displayed the same five operating system questions for every quiz. | Added `import "./App.css"` to `App.jsx`. Tested question navigation, Previous/Next, unanswered warnings, submission, results, Try Again, refresh, keyboard navigation, and mobile layout. |
| 11 | Restyle the Home page to match the same light theme and use a two-column layout on larger screens. | Updated `QuizForm.css`, `SavedQuizList.css`, a new `Home.css`, and one import in `Home.jsx`. | No issues were found after checking the CSS variables. | Used PowerShell `Select-String` to confirm that every CSS variable existed in `index.css`. Tested desktop, iPhone SE view, and keyboard Tab focus. |

---

# Prompt Log – QuizGenie (Backend Review and Final Verification)

**Member: Nida**

| # | Prompt (short) | What AI gave | What was wrong | How we fixed it |
|---|---|---|---|---|
| 1 | Review the database configuration, `schema.sql` and `quizModel.js`. Check tables, foreign keys, cascade delete, parameterized queries, transactions and database error handling. | A review of the database structure and updated code for any changed file, keeping the frontend API compatible. | The prompt said "Gemini", but our project uses a configurable provider (Groq through `AI_BASE_URL` and `AI_MODEL`). *(Add any real database issue you found.)* | Checked the relationships and tested that deleting a quiz also removes its questions and attempts. |
| 2 | Review PDF upload and text extraction: PDF only, 5 MB limit, empty, corrupted or password-protected PDFs, and temp file cleanup. | A review of `pdfService.js` and the upload route, with fixes for validation and cleanup. | *(Write what you found, for example whether temp files were deleted when an error occurred.)* | Tested a text PDF, an image-only PDF, a corrupted PDF and a non-PDF file. Unreadable PDFs return 400. |
| 3 | Review the AI integration for topic and PDF modes, 5/10/15 questions, three difficulty levels, four options per question, one correct answer, and validation of AI output before saving. | A review of `aiService.js` with response validation and error handling. | The prompt assumed Gemini. Our integration uses an OpenAI-compatible provider (Groq), so the Gemini-specific parts did not apply. | Kept our provider setup and applied only the validation and error handling ideas. |
| 4 | Review validation, security and error handling: topic, question count, difficulty, quiz IDs, submitted answers, SQL injection, key security and score manipulation. | A review of `validate.js`, `auth.js` and `errorHandler.js` with fixes. | *(Write what you found, for example the "5, 10 or 15 only" rule against what `validate.js` actually accepts.)* | Compared the rules with the real backend responses before changing anything. |
| 5 | Final backend review with Postman test cases, positive and negative tests, actual test results and a summary. | A review of all backend features, test cases and a status summary. | The prompt asked for Postman, but our team used Node.js `node:test` and `assert` instead, as our task says no external tools. | Wrote the automated tests in `backend/tests/quiz.test.js` instead (see the Automated Test Cases log). Only tests that were actually run are reported as passed. |
| 6 | Review the React frontend and backend integration: endpoints, methods, request fields, response formats, Axios setup, API keys and hidden correct answers. | A comparison of frontend calls against backend routes with fixes. | Same issues we already found: mock mode was on, the base URL was incomplete, and the `x-api-key` header was missing. | `USE_MOCK = false`, `API_BASE_URL = "http://localhost:5000/api"`, and the key header added to the shared Axios instance. |
| 7 | Complete end-to-end check of the 15-step workflow, from entering a topic to rename and delete. | A step-by-step verification plan and a final status report. | *(Write any step that failed during your own run.)* | Ran the full flow in the browser and confirmed each step. Evidence: add screenshots. |

**NIDA**

---

## 2. Prompt Log – QuizGenie (AI Integration)

**Member: Eman Ansar**

| # | Prompt (Short) | What AI Provided | What Was Wrong | How We Fixed It |
|---|---|---|---|---|
| 1 | Explain how `aiService.js` communicates with OpenAI, builds prompts, and handles generated questions. | A step-by-step explanation and some possible weak points, including fake fallback questions, answer position bias, question count validation, and environment configuration. | The concern about `.env` loading was only a possibility and had not been verified. | Shared `server.js` to check the actual environment loading sequence. |
| 2 | Check whether `server.js` loads `.env` before the AI service starts. | AI confirmed that `.env` loads first but incorrectly identified the startup API key message as an AI key issue. | The message was checking our application's own `API_KEY`, not the OpenAI API key. | Shared `quizRoutes.js` and `auth.js`. AI then corrected its explanation. |
| 3 | Explain `quizRoutes.js` and how a request reaches the AI service. | A step-by-step explanation of the request flow and several possible problems. | Some concerns about PDF cleanup and processing were raised before the PDF service had been reviewed. | Reviewed `pdfService.js` next and corrected the earlier assumptions. |
| 4 | Check how PDFs are processed, including scanned, empty, and long PDFs. | Found that empty PDFs were already rejected and extracted text was limited to 8,000 characters. Scanned PDFs containing only page numbers could still pass, while long documents only used the first 8,000 characters. | An earlier response incorrectly suggested that there was no text limit. | Corrected the understanding and recorded the remaining limitations for future improvements. |
| 5 | Review `validate.js` for topic, difficulty, and question count validation. | Explained the existing validation rules and identified possible issues with short topics and empty topic fields during PDF uploads. | Some issues depended on how the frontend submitted the form data. | Recorded them for further testing with the frontend. |
| 6 | Review the prompt used to generate quiz questions. | Identified missing rules for lecture-based questions, difficulty levels, wrong options, explanations, and answer positions. | The original prompt did not provide enough instructions to control question quality. | Asked AI to rewrite the prompt with clearer requirements. |
| 7 | Rewrite only the AI prompt for topic mode and PDF mode, including difficulty levels, wrong options, explanations, and JSON fields. | A new prompt with separate topic and PDF instructions. | The first solution identified PDF mode using text length greater than 200 characters, which was unreliable. | Requested an explicit `sourceType` value. The route now sends `pdf` when a file is uploaded and `topic` otherwise. |
| 8 | Test quiz generation using the topic "generative AI" with 10 questions. | Suggested checking the backend terminal, browser Network tab, and relevant source files. | The application showed five operating system questions. The backend received no request because the application's `API_KEY` was missing. | For local testing, changed the backend configuration to skip the application key check when `API_KEY` is not configured. |
| 9 | Investigate why the backend reported that the OpenAI key was missing. | Provided steps to check the `.env` file and environment variables. | There was no actual `.env` file; only `.env.example` existed, so the AI key was never loaded. | Created the `.env` file, kept the real key out of `.env.example`, and added a startup message to show whether the AI key was loaded. |
| 10 | Investigate why the application still generated the same operating system questions. | Identified that the frontend was still using mock data and had an incomplete backend URL. | `USE_MOCK` was still `true`, and the backend address contained `[PORT]`. | Disabled mock mode and configured the API address as `http://localhost:5000/api`. |
| 11 | Investigate why the generated quiz displayed "Sample question 1" and "Correct answer 1". | Explained the fallback question mechanism and showed where the actual error could be found. | The backend terminal showed a 401 Invalid API Key error because an example key was still present in `.env`. The application hid the real error and displayed fake questions instead. | Replaced the example key with a valid key. Removing silent error handling was also identified as an important improvement. |
| 12 | Find a free alternative to the paid OpenAI API. | Suggested Groq as an alternative provider with an OpenAI-compatible API. | No major issue was found. | Updated `aiService.js` to read the provider URL and model from `.env`, allowing the provider and model to be changed through configuration. |
| 13 | Investigate why Groq returned "Invalid API Key". | Provided a safe way to check the key's length and beginning without displaying the complete key. | The copied key was only 22 characters long, indicating that the actual key had not been copied correctly. | Generated a new key, copied it from the provider's popup, and checked its length. |
| 14 | Investigate why Groq reported that the selected model could not be found. | Provided a command to list the models available to the API key. | The suggested model `llama-3.3-70b-versatile` was no longer available for our account. | Listed the available models and switched to `openai/gpt-oss-120b`. |
| 15 | Test topic input, text PDFs, image-only PDFs, and other file types. | Explained the expected behaviour for each input type. | No implementation bug was found. The current PDF extraction process cannot read text embedded only in images. | Confirmed that topic generation works, text-based PDFs generate questions from their content, image-only PDFs return "PDF has no readable text", and unsupported file types are rejected. OCR support was recorded as a possible future improvement. |

---

## 3. Problems Found and Fixed in AI-Generated Code (AI Integration)

### Problem 1: Silent Fallback Hid AI Failures

**File:** `backend/services/aiService.js`

**What was wrong:**

When the AI request failed because of an invalid API key, an unavailable model, or a network issue, the code quietly generated sample questions such as "Sample question 1" and "Correct answer 1".

These questions were then saved and displayed as if the quiz had been generated successfully.

**Why it was a problem:**

- The application appeared to work even when the AI service was failing.
- The actual error was only visible in the backend terminal.
- It hid real errors, including a 401 invalid API key and a 404 model not found response.
- Students could receive fake questions without knowing that something went wrong.

**How I fixed it:**

- Removed automatic fake-question generation when an AI request fails.
- Added clear error handling instead of silently returning sample questions.
- The student now receives: "Quiz generation failed. Please try again."
- AI failures return a 502 response.
- Nothing is saved when AI generation fails.
- Fake fallback questions can only be enabled intentionally using `AI_FALLBACK=true` in `.env`.

**Evidence:**

- Before: `image.png`, `image-1.png`
- After: `image-2.png`, `image-3.png`

### Problem 2: Topic/PDF Mode Was Detected Using Text Length

**File:** `backend/services/aiService.js`

**What was wrong:**

The AI-generated code used the length of the input text to decide whether the source was a topic or a PDF.

```javascript
const isLecture = source.length > 200;
```

This approach was unreliable because a topic could contain more than 200 characters, while a PDF could contain very little extracted text.

**Why it was a problem:**

- A short PDF could be treated as a topic.
- The AI might use general knowledge instead of the uploaded lecture.
- The logic depended on an unrelated text-length limit in `validate.js`.

**How I found it:**

While reviewing the generated code, I noticed that the length of the text could not reliably identify where the content came from.

**My prompt to AI:**

> A topic can be longer than 200 characters and a PDF can contain less than 200 characters. So source length is not a reliable way to identify the mode. Please revise your solution to use an explicit `sourceType` value.

**How I fixed it:**

- Updated the route to pass `sourceType` explicitly.
- The backend now identifies PDF mode using the uploaded file.
- Topic mode is used when no file is uploaded.
- The frontend did not need any changes.

The route now uses:

```javascript
sourceType: file ? "pdf" : "topic"
```

**Evidence:**

- Before: `image.png`, `image-2.png`
- After: `image-3.png`, `image-4.png`

### Problem 3: Empty PDF Returned 500 Instead of 400

**Files:** `backend/services/pdfService.js`, `backend/middleware/errorHandler.js`

**What was wrong:**

The PDF service threw an error without assigning an HTTP status code when a PDF contained no readable text.

```javascript
if (!text) throw new Error("PDF has no readable text");
```

The error handler used `err.status || 500`, so the application treated this user input problem as an internal server error.

**Why it was a problem:**

- An unreadable PDF is an input problem, not necessarily a server failure.
- A 500 response makes debugging and monitoring less clear.
- In production, the error handler could replace the useful message with a generic server error.

**How I fixed it:**

- Empty PDFs now return 400 with a clear message.
- Damaged or password-protected PDFs return 400.
- AI generation failures return 502.
- Missing AI configuration returns 503.
- The error handler hides unexpected internal 500 errors in production while keeping useful messages for expected client errors.

**Evidence:**

- Before: `image.png`
- After: `image-1.png`

### Problem 4: Frontend Was Still Using Mock Data

**File:** `frontend/src/api/quizApi.js`

**What was wrong:**

The frontend was still running in mock mode, meaning it never sent quiz generation requests to the backend.

The configuration also contained an incomplete backend URL.

```javascript
const USE_MOCK = true;
```

**How I found it:**

I entered "generative AI" and selected 10 questions, but the application displayed the same five operating system questions. The backend terminal showed no request activity.

**How I fixed it:**

Updated the configuration:

```javascript
const USE_MOCK = false;
const API_BASE_URL = "http://localhost:5000/api";
```

Now, the frontend sends requests to the actual backend instead of returning sample data.

**Evidence:**

- Before: `p4-before-os-questions.png`
- After: `p4-after-real-questions.png`

### Problem 5: Correct Answer Position Bias

**File:** `backend/services/aiService.js`

**What was wrong:**

The original AI prompt included an example where `correctIndex` was always `0`. This could encourage the model to place the correct answer first.

As a result, students might notice a pattern and guess option A more frequently.

**How I fixed it:**

I added a `shuffleOptions()` function using the Fisher-Yates shuffle algorithm.

It randomly changes the order of the four options and updates `correctIndex` so that it still points to the correct answer after shuffling.

**Testing and evidence:**

Generated four quizzes containing 35 questions and compared the correct answer positions before and after shuffling.

| Position | Before Shuffle (AI) | After Shuffle (Code) |
|---|---:|---:|
| 0 (A) | 11 (31%) | 6 (17%) |
| 1 (B) | 13 (37%) | 9 (26%) |
| 2 (C) | 6 (17%) | 10 (29%) |
| 3 (D) | 5 (14%) | 10 (29%) |
| A + B Together | **24 (69%)** | **15 (43%)** |

The results showed that the correct answers were more evenly distributed after shuffling.

**Evidence:** `image-1.png`, `image-2.png`, `image-3.png`

### Problem 6: Default AI Model Did Not Match the Selected Provider

**File:** `backend/services/aiService.js`

**What was wrong:**

The code still had an OpenAI model as its default:

```javascript
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
```

After switching to Groq, this default could cause problems if `AI_MODEL` was missing from `.env`.

Groq might receive a model name that was not available through its API.

**How I fixed it:**

- Removed the misleading default model.
- Added a configuration check when the model is missing.
- The backend now returns a clear 503 response when the required model configuration is unavailable.
- Added the active model to the startup information.

This made the provider configuration easier to understand and troubleshoot.

---

## 4. Frontend/Backend Mismatches

### Mismatch 1: Frontend Was Not Connected to the Backend

**File:** `frontend/src/api/quizApi.js`

**Problem:**

The frontend still had `USE_MOCK = true` and an incomplete backend URL. This meant the frontend was using sample quizzes instead of communicating with the actual backend.

**How I found it:**

After entering a new topic and selecting 10 questions, the application still displayed five operating system questions. The backend terminal showed no incoming request.

**Fix:**

```javascript
const USE_MOCK = false;
const API_BASE_URL = "http://localhost:5000/api";
```

This connected the frontend to the local backend.

**Evidence:**

- Before: `p4-before-os-questions.png`
- After: `p4-after-real-questions.png`

### Mismatch 2: Missing API Key Header

**Problem:**

The backend required an `x-api-key` header for quiz creation, renaming, and deletion. However, the frontend was not sending this header.

Both sides worked separately, but the requests were rejected with a 401 Unauthorized response.

**Fix:**

Added the application key to the shared Axios instance so that all requests use the same configuration.

```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY
  }
});
```

The `VITE_API_KEY` in `frontend/.env` must match the `API_KEY` configured in `backend/.env`.

**Security note:** A Vite environment variable is included in frontend code and can be inspected by users. This header should not be treated as a secure way to protect production API access. Proper backend authentication and authorization are needed for production.

---

## 5. Other Problems Solved

| Problem | What We Changed |
|---|---|
| Authentication could switch off silently when `API_KEY` was missing. | Restored the application's API key check so that requests are rejected when the key is not configured. |
| Startup message only checked the application key but was confused with the AI key. | Updated startup information to show the application key, AI key, and model separately. |
| Damaged or password-protected PDFs returned confusing 500 errors. | Updated the handling to return a 400 response with a clearer message. |
| OpenAI API required a paid plan. | Made the AI provider configurable using `AI_BASE_URL` and `AI_MODEL`, then switched to Groq. |
| The suggested Groq model was unavailable. | Checked the available models and selected `openai/gpt-oss-120b`. |
| AI failures were hidden behind sample questions. | Improved error handling and stopped automatic fallback generation. |

---

## 6. Prompt Improvement (Version 1 vs Version 2)

### Problems with the Original Prompt (V1)

The original prompt did not provide enough guidance for generating reliable study questions.

The main issues were:

- It did not clearly separate topic-based and PDF-based generation.
- Difficulty levels were mentioned without explaining what Easy, Medium, and Hard should mean.
- There were no proper instructions for creating believable wrong options.
- The example used `correctIndex: 0`, which could encourage answer position bias.
- It did not explain how to handle instructions that might appear inside uploaded PDF content.

### Improvements in the New Prompt (V2)

The updated prompt included clearer instructions for generating better questions.

- Separate instructions for topic mode and PDF mode.
- Topic mode uses general knowledge, while PDF mode uses the uploaded lecture content.
- Easy questions focus on recall.
- Medium questions focus on understanding and application.
- Hard questions focus on analysis and reasoning.
- Wrong options should be believable and related to the question.
- Duplicate and unclear questions should be avoided.
- Each question should include a useful explanation of one or two sentences.
- Lecture content is placed inside `<lecture_content>` tags and treated as study material, not as instructions.

These changes gave the AI clearer expectations and improved the structure and quality of generated questions.

---

## 7. Vague vs Detailed Prompt (QuizForm)

### Original Vague Prompt

> Create a quiz generator form in React. The user should be able to type a topic or upload a PDF, pick a difficulty level and how many questions they want, then press a button to generate the quiz.

### Improved Detailed Prompt

The updated prompt asked AI to rebuild the same form with specific requirements for data handling, validation, accessibility, responsiveness, and state management.

It included:

- Send uploaded PDFs using the `file` field to match the backend API contract.
- Require a topic of at least three characters.
- Allow PDF uploads only, with a maximum file size of 5 MB.
- Display the selected file name with a Remove button.
- Connect labels with their input fields using `htmlFor` and `id`.
- Use `aria-pressed` for the Enter Topic and Upload PDF tabs.
- Announce errors using `role="alert"`.
- Add a visible keyboard focus style using `:focus-visible`.
- Maintain WCAG AA colour contrast.
- Keep labels left-aligned and easy to read.
- Add mobile styling with proper screen margins and full-width fields.
- Display "Generating..." while the request is processing.
- Disable the complete form during loading using a fieldset.
- Clear previous errors when the user changes an input.

### Main Differences

| Area | Vague Prompt | Detailed Prompt |
|---|---|---|
| Data Handling | Sent PDF using the wrong field name, `pdf`. | Uses the correct `file` field. |
| Validation | No PDF size limit and accepted very short topics. | Checks file type, 5 MB limit, and minimum topic length. |
| Accessibility | Missing screen-reader announcements and clear focus styles. | Uses `role="alert"`, `aria-pressed`, labels, and keyboard focus styling. |
| Responsiveness | Form spacing was not properly adjusted for mobile. | Adds mobile margins, full-width fields, and smaller padding. |
| State Management | Displayed a loading message. | Also disables the complete form during generation and clears old errors when inputs change. |

**UI issue fixed:** The original form touched the screen edges on mobile and had labels that were difficult to read. These issues were improved with responsive styling, left-aligned labels, and better contrast.

**Screenshots:**

- `docs/screenshots/vague-desktop.png`
- `docs/screenshots/vague-mobile.png`
- `docs/screenshots/detailed-desktop.png`
- `docs/screenshots/detailed-mobile.png`

---

## 8. Prompt Log – QuizGenie (Database and Quiz Management)

**Member: Anfal**

| # | Prompt (short) | What AI gave | What was wrong | How we fixed it |
|---|---|---|---|---|
| 1 | Review `schema.sql` and `db.js`: tables, foreign keys, `ON DELETE CASCADE`, database connection, migrations, missing indexes and constraints for quiz attempts. | A review of the three tables (quizzes, questions, attempts), the foreign key setup and cascade deletion, with corrected `schema.sql` and `db.js`. | I did not find any major issue in the generated schema. *(Add any real issue, for example a missing index or a foreign key setting.)* | Checked the table relationships and tested that deleting a quiz also removes its questions and attempts. |
| 2 | Review `quizModel.js` and fix `createQuiz()` so a quiz and all its questions are saved together, with options stored using `JSON.stringify()` and rollback on error. | A `createQuiz()` function that saved the quiz first and then inserted its questions one by one. | **Non-trivial issue:** If an error happened while saving the questions, the quiz could stay in the database with only some of its questions. | Used `db.transaction()` from `better-sqlite3`, so the quiz and all its questions are saved together or rolled back if anything fails. |
| 3 | Review `validate.js` and `quizRoutes.js`: topic 3 to 200 characters, difficulty Easy/Medium/Hard, question count 5/10/15, PDF upload without a topic, file type and size checks, and temp file deletion. | Validation rules for topic, difficulty and question count, with corrected `validate.js` and route code. | **Non-trivial issue:** PDF uploads could fail because the validator checked the topic even when a file was uploaded and the topic field was empty. *(Add anything else you found, for example temp file cleanup on errors.)* | Changed the condition so topic validation only runs when `req.file` is not present. Tested with a PDF upload and with a topic only. |
| 4 | Review `evaluationService.js`: compare answers with `correctIndex`, reject incomplete answers, duplicate question IDs, invalid question IDs and invalid `selectedIndex`, and return 400. | A function that compared submitted answers with the correct answers and calculated score, total and percentage. | **Non-trivial issue:** The function did not check that every question had a submitted answer, so a five-question quiz could be scored with only two answers. *(The prompt also asked for duplicate ID and invalid index checks. Write which of these were already handled and which you added.)* | Added a check at the start of `evaluateAnswers()` that compares the submitted answer count with the number of questions and throws an error with `status = 400`. |
| 5 | Review all queries in `quizModel.js` (select, insert, update, delete, attempts) for SQL injection and use parameterized queries. | A check of every query type for `?` placeholders and a statement of whether a fix was needed. | I checked the existing queries and did not find a SQL injection risk. | Verified that all queries use prepared statements with parameterized values. No change was needed. |
| 6 | Review the React frontend and backend connection: endpoints, methods, request fields, response formats, error display and API key handling. | A comparison of frontend API calls with backend routes, with fixes for affected files. | Two mismatches: `USE_MOCK` was `true` with an incomplete URL (`localhost:[PORT]`), and the frontend did not send the `x-api-key` header, so requests got 401. | Set `USE_MOCK = false` and `API_BASE_URL = "http://localhost:5000/api"`, and added the `x-api-key` header to the shared Axios instance. `VITE_API_KEY` must match the backend `API_KEY`. |

---

## 9. Problems Found and Fixed in AI-Generated Code (Database and Quiz Management)

### Problem 1: Quiz Could Be Saved Without All Its Questions

**File:** `backend/models/quizModel.js`

**What was wrong:**

While reviewing the generated function, I noticed that it saved the quiz first and then added questions one by one. If an error occurred halfway through, the quiz could remain saved with only some of its questions.

**Why it mattered:**

- A quiz could be stored without all its questions.
- Students might see incomplete quizzes.
- It could leave inconsistent data in the database.

**How I fixed it:**

I used `db.transaction()` from `better-sqlite3`. Now, either the quiz and all its questions are saved successfully, or the database rolls back the changes if something goes wrong.

```javascript
const tx = db.transaction(() => {
  const info = insertQuiz.run(
    title,
    topic,
    difficulty,
    numQuestions,
    createdAt
  );

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
```

### Problem 2: PDF Upload Was Blocked by Topic Validation

**File:** `backend/middleware/validate.js`

**What was wrong:**

During code review, I found that topic validation was also running when a user uploaded a PDF. Since the topic field could be empty in this case, the backend rejected an otherwise valid upload.

**Why it mattered:**

- Users could face errors while generating quizzes from PDFs.
- The application asked for a topic even when the user had already provided a PDF.

**How I fixed it:**

I changed the validation condition so that topic validation only runs when no file has been uploaded.

```javascript
if (!req.file && topic !== undefined) {
  // Topic validation
}
```

After this change, users can upload PDFs without being blocked by unnecessary topic validation.

### Problem 3: Backend Accepted Incomplete Quiz Answers

**File:** `backend/services/evaluationService.js`

**What was wrong:**

While checking the score calculation, I noticed that the backend was not checking the total number of submitted answers. For example, a quiz with five questions could receive only two answers and still be processed.

**Why it mattered:**

- The application could calculate an incorrect score.
- Incomplete attempts could be saved.
- A user could potentially manipulate the evaluation by sending incomplete answers.

**How I fixed it:**

I added a condition at the beginning of `evaluateAnswers()` to make sure that every question has a corresponding submitted answer.

```javascript
export function evaluateAnswers(questions, submittedAnswers) {
  if (submittedAnswers.length !== questions.length) {
    const err = new Error(
      `Incomplete answers. Expected ${questions.length}, got ${submittedAnswers.length}`
    );

    err.status = 400;
    throw err;
  }

  // Remaining evaluation logic
}
```

Now, if the submitted answer count does not match the total number of questions, the backend returns a 400 Bad Request response instead of calculating an incorrect score.

### Problem 4: Database Errors Were Difficult to Understand

**File:** `backend/middleware/errorHandler.js`

**\*\*What was wrong:\*\***

\`\`\`javascript
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
\`\`\`

We switched to Groq, but the default was still an OpenAI model. If \`AI_MODEL\` was missing in \`.env\`, the app would ask Groq for a model it doesn't have and fail with a confusing 404 error.

**\*\*How I fixed it:\*\***

\- Removed the hidden default.

\- If the model is missing, the student gets a clear message (503), and the terminal says exactly what is missing.

\- The backend startup now shows the active model.

\---

**## Frontend/Backend Mismatches**

**### Mismatch 1: Frontend Still Using Mock Data**

**\*\*Problem:\*\*** \`quizApi.js\` still had \`USE_MOCK = true\` and a placeholder URL (\`localhost:[PORT]\`). The frontend never called the backend, so every quiz showed the same 5 operating system questions, whatever the topic or count.

**\*\*How I found it:\*\*** I entered "generative AI" with 10 questions and got 5 OS questions. The backend terminal showed no activity.

**\*\*Fix:\*\***

\`\`\`javascript
const USE_MOCK = false;
const API_BASE_URL = "http://localhost:5000/api";
\`\`\`

![Before]\(p4-before-os-questions.png)

![After]\(p4-after-real-questions.png)

\---

**### Mismatch 2: Missing API Key Header**

**\*\*Problem:\*\*** The backend requires an \`x-api-key\` header for create, rename and delete, but the frontend did not send it. Both sides worked alone but did not agree, so these requests were rejected (401).

**\*\*Fix:\*\*** Added the header once to the shared axios instance, so every request sends it:

\`\`\`javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "x-api-key": import.meta.env.VITE_API_KEY },
});
\`\`\`

\`VITE_API_KEY\` in \`frontend/.env\` must match \`API_KEY\` in \`backend/.env\`.

\---

**## Other Problems Solved**

\| Problem | Fix |
\|---|---|
\| Auth could switch off silently when \`API_KEY\` was missing | Restored the safe check: no key → requests rejected with a clear error |
\| Startup message said "API key" but only checked the app key | Startup now shows App key, AI key and Model separately |
\| Damaged or password-protected PDFs gave confusing 500 errors | Now return 400: "Could not read this PDF. It may be damaged or password-protected." |
\| OpenAI API is paid | Made the provider configurable (\`AI_BASE_URL\`, \`AI_MODEL\`) and switched to free Groq |
\| Model \`llama-3.3-70b-versatile\` returned 404 | Listed the provider's available models and chose \`openai/gpt-oss-120b\` |

**## Prompt Improvement (Version 1 → Version 2)**

**\*\*Problems with the original prompt (V1):\*\***

\- No difference between topic mode and PDF mode

\- Difficulty was just one word ("Easy", "Hard") with no meaning

\- No rules for good wrong options

\- Example showed \`correctIndex: 0\` (caused answer bias)

\- No protection against instructions hidden inside PDF text

**\*\*Improvements in the new prompt (V2):\*\***

\- System message with clear rules + user message with the inputs

\- Topic mode uses general knowledge; PDF mode uses only the lecture content

\- Difficulty defined: Easy = recall, Medium = understanding/application, Hard = analysis/reasoning

\- Rules for believable wrong options, no "All of the above"

\- No duplicate or unclear questions

\- Useful 1–2 sentence explanations

\- Lecture text placed inside \`<lecture_content>\` tags and treated as study material only

**## Vague vs Detailed Prompt (UI component: QuizForm)**

\- **\*\*Vague prompt:\*\*** "Create a quiz generator form in React. The user should be able to type a topic or upload a PDF, pick a difficulty level and how many questions they want, then press a button to generate the quiz."

\- **\*\*Detailed prompt:\*\*** Asked to rebuild the same form with clear requirements: send the PDF as "file"; topic of at least 3 characters; PDF only and max 5 MB; show the selected file name with a Remove button; labels linked with htmlFor/id; aria-pressed on the Enter Topic / Upload PDF toggle; role="alert" for errors; keyboard support with :focus-visible; WCAG AA contrast on a dark background; a mobile media query with margin from the screen edges and full-width fields; left-aligned labels; "Generating..." with the whole form disabled using a fieldset; and clearing the error when the user changes the input.

\- **\*\*Differences:\*\***

  - **\*\*Data:\*\*** the vague version sent the PDF as "pdf" (did not match our API contract); the detailed version sends it as "file".
  - **\*\*Validation:\*\*** the vague version had no file size limit and accepted a 1-letter topic; the detailed version rejects PDFs over 5 MB, needs at least 3 characters and shows the file name with a Remove button.
  - **\*\*Accessibility:\*\*** in the vague version errors were not announced to screen readers, the selected tab was shown only by colour, there was no clear focus style and labels had low contrast; the detailed version uses role="alert", aria-pressed, a yellow :focus-visible outline and high-contrast left-aligned labels.
  - **\*\*Responsiveness:\*\*** on mobile the vague form touched the screen edges and had the same spacing as on a laptop; the detailed version keeps a margin from the edges, stacks all fields at full width and uses smaller padding.
  - **\*\*State:\*\*** both showed "Generating..."; the detailed version also disables the whole form while loading and clears the error as soon as the user changes the input.

\- **\*\*UI problem fixed:\*\*** the form touched the screen edges on mobile and labels were hard to read; fixed with a mobile media query, left-aligned labels and better contrast.

\- **\*\*Screenshots:\*\*** docs/screenshots/vague-desktop.png, docs/screenshots/vague-mobile.png, docs/screenshots/detailed-desktop.png, docs/screenshots/detailed-mobile.png

---

# Prompt Log – QuizGenie (Automated Test Cases)

**Member: Kashaf**

| # | Prompt (short) | What AI gave | What was wrong | How we fixed it |
|---|---|---|---|---|
| 1 | Review my actual backend (routes, auth middleware, validation, error handler, AI service, database model and schema) and create automated test cases using Node.js only, without Postman, Jest or any external framework. | AI reviewed the backend files and proposed a plan using Node's built-in `node:test` and `assert`. Tests start a local Express server on a random port with the real `quizRoutes`, `notFound` and `errorHandler`, and send real HTTP requests with `fetch`. It also found the order of checks: authentication, then topic/PDF validation, then difficulty validation. | Nothing wrong with the review. | Created `backend/tests/quiz.test.js` and built all tests against the actual routes and middleware instead of assumed responses. |
| 2 | **TC-01:** Test that quiz creation is rejected when the API key is missing. | A test that sends `POST /api/quizzes` without the `x-api-key` header. | **Non-trivial issue:** The first summary said TC-01 returns 500 "Server auth misconfigured". Our `auth.js` returns 500 only when the server's own `API_KEY` variable is missing. A request without the header, when the server key is set, returns 401. | Corrected TC-01 to test the missing request header and assert 401 with "Unauthorized: invalid API key". The test sets a temporary `API_KEY` and restores the old value afterwards. |
| 3 | **TC-02 to TC-04:** Test quiz creation with missing topic and PDF, invalid difficulty, and unsupported question count. | Three validation tests that send a valid API key and one invalid field each. | Nothing wrong. | Asserted HTTP 400 and the exact backend messages. TC-02: "Please provide a topic or a PDF file". TC-03: "difficulty must be Easy, Medium or Hard". TC-04: checked against the message in `validate.js`. |
| 4 | **TC-05:** Test successful quiz creation. | A test that creates a quiz with a valid topic, difficulty and question count. | AI did not want to call the real AI provider in tests, since that depends on a paid or rate-limited API and returns random questions. | Ran the test without calling the live provider and checked the saved quiz title, topic, difficulty and number of questions. |
| 5 | **TC-06 and TC-07:** Test quiz retrieval, the quiz list, and an invalid quiz ID. | Tests for `GET /api/quizzes` and `GET /api/quizzes/:id`, plus a request with a nonexistent ID. | Nothing wrong. | Verified quiz details, questions, list contents and the 404 response for an invalid ID. |
| 6 | **TC-08 and TC-12:** Test submitting an empty answers list and an invalid selected option index. | Two validation tests for the attempt route. | Nothing wrong. | Asserted 400 for empty answers and for a selected index outside the valid range. Both use the status and error message the backend actually returns. |
| 7 | **TC-09, TC-10 and TC-11:** Test evaluation with all correct, all incorrect, and partially answered questions. | Three tests that create a quiz, submit answers and check the result. | Partial answers had to match Anfal's check in `evaluateAnswers()`, which rejects a submission whose answer count differs from the question count. | Made sure unanswered questions are sent in the format the backend expects. Verified score, percentage, correct answers and unanswered count for each case. |
| 8 | **TC-13, TC-14 and TC-15:** Test renaming a quiz, renaming with an empty title, and renaming a nonexistent quiz. | Three tests for the rename route. | Nothing wrong. | Asserted a successful update, 400 for an empty title and 404 for a missing quiz, using the real error messages. |
| 9 | **TC-16:** Test quiz deletion and database integration. | A test that deletes a quiz and then checks the database. | Nothing wrong. | Verified that the quiz, its questions and its attempts are all removed (cascade delete from `schema.sql`). |
| 10 | Make each test check the actual status code and error message, keep tests separate with clear IDs, and run them all. | A single file with 16 clearly labelled tests (TC-01 to TC-16). | Nothing wrong. | Ran `node --test tests/quiz.test.js` and `npm test`. Evidence: add screenshot of the passing run. |

## Test Case Summary

| ID | What it tests | Expected status |
|---|---|---|
| TC-01 | Quiz creation without API key | 401 |
| TC-02 | Quiz creation without topic and PDF | 400 |
| TC-03 | Quiz creation with invalid difficulty | 400 |
| TC-04 | Quiz creation with unsupported question count | 400 |
| TC-05 | Successful quiz creation | 201 |
| TC-06 | Quiz retrieval and quiz list | 200 |
| TC-07 | Invalid quiz ID | 404 |
| TC-08 | Empty answer submission | 400 |
| TC-09 | Evaluation with all correct answers | 200 |
| TC-10 | Evaluation with all incorrect answers | 200 |
| TC-11 | Evaluation with partially answered quiz | 200 |
| TC-12 | Invalid selected option index | 400 |
| TC-13 | Rename quiz successfully | 200 |
| TC-14 | Rename quiz with empty title | 400 |
| TC-15 | Rename nonexistent quiz | 404 |
| TC-16 | Delete quiz and related data | 200 |

## Automated Testing Summary

- Created 16 automated test cases (TC-01 to TC-16).
- Tested authentication and input validation.
- Tested quiz creation, retrieval, renaming and deletion.
- Tested correct, incorrect and partially answered submissions.
- Verified scores, percentages and evaluation results.
- Tested integration with the Express routes and the SQLite database.
- Used Node.js built-in `node:test` and `assert`, with no Postman, Jest or external framework.

**KASHAF**