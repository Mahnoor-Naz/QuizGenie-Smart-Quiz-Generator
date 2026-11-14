# QuizGenie - Smart Quiz Generator

## Project Description

QuizGenie is a web application that helps students prepare for exams. Students can upload a lecture PDF or enter a topic, and QuizGenie uses Gemini AI to turn it into a multiple-choice quiz. Students can then attempt the quiz, check their results with explanations, and save quizzes to practice again later.

## Features

- **Generate Quiz:** Upload a lecture PDF or enter a topic, then choose a difficulty level (Easy, Medium, Hard) and the number of questions (5, 10, 15).
- **AI Quiz Generation:** Gemini AI creates multiple-choice questions, each with four options.
- **Attempt Quiz:** Answer the questions one by one using the Previous and Next buttons, with a progress indicator.
- **Results:** See your score, percentage, and correct and wrong answers with explanations. You can also try the quiz again.
- **Saved Quizzes:** View, rename and delete your saved quizzes.

## Technologies Used

| Category | Technology |
|----------|------------|
| Frontend | React 19.3.1, React DOM 19.3.1, React Router DOM 7.18.5, Axios 1.21.0, Vite 8.3.6 |
| Backend | Node.js 24.14.0, Express |
| Database | MySQL 8.0.45 |
| AI | Gemini API |
| Tools | VS Code, Git, GitHub, ChatGPT/Claude (AI-assisted coding) |

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/quizzes` | Generate and save a new quiz |
| GET | `/api/quizzes` | Get all saved quizzes |
| GET | `/api/quizzes/:id` | Get a single quiz by ID |
| PUT | `/api/quizzes/:id` | Update (rename) a quiz |
| DELETE | `/api/quizzes/:id` | Delete a quiz |
| POST | `/api/quizzes/:id/attempts` | Submit a quiz attempt and get the result |

## Setup and Installation (Windows)

### Prerequisites

- Node.js 24.14.0
- MySQL 8.0.45
- A Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/Mahnoor-Naz/QuizGenie-Smart-Quiz-Generator.git
cd QuizGenie-Smart-Quiz-Generator
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to a new file named `.env` inside the `backend` folder and fill in your details:

```env
GEMINI_API_KEY=your_gemini_api_key
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=database_name
```

> **Note:** The `.env` file contains private keys and passwords. It is listed in `.gitignore` and should **not** be pushed to GitHub.

Create the MySQL database, then start the backend server:

```bash
[backend start command, e.g. npm start]
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local link shown in the terminal in your browser.

## Usage

1. **Generate a Quiz:** Upload a lecture PDF or type a topic, choose the difficulty and number of questions, then click Generate.
2. **Attempt the Quiz:** Select an answer for each question and move between questions with the Previous and Next buttons.
3. **View Results:** After you submit, see your score, percentage, and correct and wrong answers with explanations. Click **Try Again** to reattempt.
4. **Manage Saved Quizzes:** On the Home page, start, rename or delete any saved quiz.

## Team Members and Roles

| Name | Role | Responsibilities |
|------|------|------------------|
| Mahnoor Ahmer | Frontend Developer and Manager | React pages, UI components, routing and connecting the UI to the API |
| [Name] | Backend Developer | [Responsibilities] |
| Eman Ansar | AI Integration | Connected the frontend to the backend; designed and improved the AI prompt (topic & PDF modes, difficulty levels, answer rules); set up Groq (`openai/gpt-oss-120b`) via configurable `.env`; fixed silent fallback, error status codes (400/502/503), mode detection (`sourceType`) and answer position bias (shuffle); maintained the prompt log with before/after evidence |
| Anfal | **Database and Quiz Management** | Designed the SQLite schema with foreign keys and CASCADE delete; wrote parameterized queries to prevent SQL injection; used database transactions for atomic quiz creation; fixed the PDF upload validation bug and incomplete answer submission bug |
| [Name] | Quiz Evaluation, Testing and Integration | [Responsibilities] |

## AI Assisted Development

We used AI tools to help write parts of the code. We then tested the application ourselves, found the problems and fixed them. The prompts we used are recorded in [docs/prompt-log.md](docs/prompt-log.md).

## GitHub Collaboration

Our team worked in one shared GitHub repository. The project has separate `frontend` and `backend` folders so members could work on their parts without conflicts. Each member committed their own work to the repository.