# QuizGenie – Smart Quiz Generator
### Project Specification | Week 13

## 1. Project Description

QuizGenie is an AI-powered Smart Quiz Generator designed to help students prepare for exams. Students can upload lecture PDFs or enter a topic to generate multiple-choice questions (MCQs). They can select the difficulty level and number of questions, attempt quizzes, view their results with explanations, and save quizzes for future practice.

## 2. Entities

The application uses the following main entities:

| Entity | Description |
|---|---|
| Quiz | Stores quiz details, including title, topic, difficulty and questions. |
| Question | Stores individual MCQs belonging to a quiz. |
| Option | Stores the four possible answers for each question. |
| Attempt | Stores quiz attempts, submitted answers, scores and results. |

## 3. API Endpoints

The following main API endpoints support quiz operations:

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/api/quizzes` | Generates and saves a new quiz. |
| GET | `/api/quizzes` | Retrieves all saved quizzes. |
| GET | `/api/quizzes/:id` | Retrieves one saved quiz with its questions. |
| PUT | `/api/quizzes/:id` | Updates or renames an existing quiz. |
| DELETE | `/api/quizzes/:id` | Deletes a saved quiz. |
| POST | `/api/quizzes/:id/attempts` | Submits a quiz attempt and returns the result. |

## 4. User Interface Screens

**Screen 1: Quiz Generation Screen**
- Allows students to enter a topic or upload a PDF.
- Provides difficulty options: Easy, Medium and Hard.
- Allows students to select 5, 10 or 15 questions.
- Generates a quiz using AI.

**Screen 2: Quiz Attempt Screen**
- Displays one MCQ at a time with four answer options.
- Provides Previous and Next navigation buttons.
- Shows quiz progress while attempting questions.

**Screen 3: Results and Saved Quizzes Screen**
- Displays the final score and percentage.
- Shows correct and incorrect answers with explanations.
- Allows students to retake quizzes.
- Provides options to view, rename and delete saved quizzes.

## 5. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 19.3.1, React DOM 19.3.1 |
| Routing | React Router DOM 7.18.5 |
| HTTP Requests | Axios 1.21.0 |
| Build Tool | Vite 8.3.6 |
| Backend | Node.js 24.14.0, Express |
| File Upload and PDF | Multer, pdf-parse |
| Database | SQLite |
| AI Integration | Groq API (model `openai/gpt-oss-120b`) through the OpenAI-compatible API, using the `openai` npm package |
| Development Tools | Visual Studio Code, Git and GitHub |

## 6. AI Integration Details

**Provider and configuration**
- The AI provider, model and keys are set in the backend `.env` file (`OPENAI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`), not in the code.
- Because the API is OpenAI-compatible, the provider can be changed (for example to OpenAI gpt-4o-mini) by editing `.env` only.

**Generation modes**
- **Topic mode:** the AI uses its general knowledge at university level.
- **PDF mode:** the AI uses only the text of the uploaded lecture and does not add outside facts.
- The mode is decided by the server (a PDF file means PDF mode), not guessed from the text.
- Uploaded text is treated as study material only, and instructions inside it are ignored.

**Difficulty levels**
- Easy: recall of facts, definitions and terms.
- Medium: understanding and application of concepts.
- Hard: analysis and reasoning.

**Input rules**
- Topic: 3 to 200 characters.
- Difficulty: Easy, Medium or Hard.
- Number of questions: 5, 10 or 15.
- PDF: PDF files only, maximum 5 MB, text-based PDFs only (no OCR, so text inside images is not read).
- Only the first 8,000 characters of a PDF are sent to the AI.
- Creating, renaming and deleting quizzes require the `x-api-key` header.

**Question quality and processing**
- Each question has exactly four distinct options, one correct answer and an explanation.
- The AI reply is validated (question text, four options, valid correct answer index).
- The order of the options is shuffled in code, so the correct answer is not always in the same position.

**Error handling**
- Empty, unreadable or damaged PDFs return a clear message (HTTP 400).
- If the AI fails, the student sees a clear message (HTTP 502 or 503) and no quiz is saved.
- Placeholder questions are used only if `AI_FALLBACK=true` is set for testing.

**Known limitations**
- No OCR for scanned or image-only PDFs.
- Long PDFs are limited to the first 8,000 characters.
- The frontend API key is visible in the browser, so it only prevents casual misuse and is not full security.

## 7. Expected Outcome

The final application provides students with an easy way to generate, attempt, evaluate and save AI-generated quizzes, making exam preparation more interactive and efficient.