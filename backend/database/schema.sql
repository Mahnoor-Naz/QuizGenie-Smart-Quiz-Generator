-- QuizGenie schema (parameterized queries only!)

CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  topic TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy','Medium','Hard')),
  numQuestions INTEGER NOT NULL CHECK (numQuestions IN (5,10,15)),
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quizId INTEGER NOT NULL,
  text TEXT NOT NULL,
  options TEXT NOT NULL,
  correctIndex INTEGER NOT NULL CHECK (correctIndex BETWEEN 0 AND 3),
  explanation TEXT,
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quizId INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  answers TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_questions_quizId ON questions(quizId);