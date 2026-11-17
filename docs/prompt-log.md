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

| # | Prompt (Short) | What AI Provided | What Was Wrong | How We Fixed It |
|---|---|---|---|---|
| 1 | Review `schema.sql` and `db.js` for a SQLite database managing quizzes, questions, and attempts. | AI provided a database structure with three tables, foreign keys, and cascade deletion. | I did not find any major issue in the generated schema. | I checked the table relationships and tested that deleting a quiz also removes its related questions and attempts. |
| 2 | Write the `createQuiz` function in `quizModel.js` to save a quiz and its questions. | AI generated a function that first saved the quiz and then inserted its questions one by one. | **Non-trivial issue:** If something went wrong while saving the questions, the quiz could still be saved without all its questions. | I fixed this by using `db.transaction()` from `better-sqlite3`, so the complete quiz is saved together or rolled back if an error occurs. |
| 3 | Review `validate.js` and `quizRoutes.js` for input validation. | AI added checks for the topic, difficulty, and number of questions. | **Non-trivial issue:** PDF uploads could fail because the validator was checking the topic even when a file was provided. | I updated the condition to skip topic validation when `req.file` is available. |
| 4 | Review `evaluationService.js` for calculating quiz scores. | AI generated a function to compare submitted answers with the correct answers and calculate the final score. | **Non-trivial issue:** The function did not check whether the user had submitted answers for all questions. | I added a check to compare the submitted answer count with the total number of questions before calculating the score. |
| 5 | How to prevent SQL injection in `quizModel.js`. | AI suggested using parameterized queries with `?` placeholders. | I checked the existing queries and did not find a major issue with SQL injection protection. | I verified that the database queries use prepared statements and parameterized values. |

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

**What was wrong:**

I also noticed that the error handler returned the same generic message, "Invalid data", whenever a SQLite constraint error occurred.

```javascript
if (err.code === "SQLITE_CONSTRAINT") {
  return res.status(400).json({
    error: "Invalid data"
  });
}
```

This did not give much information about what the user needed to correct.

**Why it mattered:**

- Users could not easily understand why their data was rejected.
- It made database errors harder to investigate.
- The error message did not provide useful guidance.

**How I fixed it:**

I updated the message to give users a better idea of which fields might need checking.

```javascript
if (err.code === "SQLITE_CONSTRAINT") {
  return res.status(400).json({
    error: "Invalid data format. Please check difficulty, number of questions, or options."
  });
}
```

This makes database-related errors easier to understand and helps users identify possible input problems.

---

## 10. Summary of Anfal's Database and Quiz Management Contribution

I worked on reviewing the database structure and making the quiz management process more reliable. During the code review, I found a few issues that were not obvious in the initial AI-generated code.

My main contributions included:

- Checking database tables and their relationships.
- Making sure quizzes and their questions are saved together.
- Fixing validation issues with PDF uploads.
- Preventing incomplete answer submissions during score calculation.
- Checking SQL queries for possible injection risks.
- Making database error messages more helpful.

These improvements helped make quiz saving, PDF uploads, and result evaluation more reliable.

---

## 11. Overall Project Learning and Conclusion

Working on QuizGenie gave our team an opportunity to use AI for frontend development, backend integration, database management, and code review.

Although AI helped us generate code and explain different parts of the project, its suggestions were not always correct or ready to use. We had to review the generated code, compare it with our API contract, run tests, and fix issues manually.

Some of the important things we learned during this process were:

- A detailed prompt usually produces more useful code than a vague instruction.
- AI-generated code should always be checked before using it in a project.
- Testing is important because some problems only appear when different parts of the application work together.
- Error handling should show meaningful messages instead of hiding failures.
- Backend validation is important even when the frontend already checks user input.
- Database transactions help protect data when multiple related records are saved.
- Accessibility and responsive design should be considered during development, not added only at the end.
- AI tools are helpful for development, but the final decisions and testing still require developer involvement.

