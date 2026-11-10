// src/api/quizApi.js
// Data service: all quiz CRUD operations and answer submission.
// Screens call these functions instead of handling data themselves.

import axios from "axios";
import { mockQuizList, mockQuiz, mockAttemptResult } from "../mock/mockQuiz.js";

// ON/OFF SWITCH
// true  = use mock data (backend not ready)
// false = use the real backend
const USE_MOCK = false;

// Address of the real backend (change this to your backend's URL)
const API_BASE_URL = "http://localhost:5000/api";
// Axios setup for the real backend
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "x-api-key": import.meta.env.VITE_API_KEY },
});

// MOCK HELPERS

// Waits for a short time so the loading message can be shown
const MOCK_DELAY = 800; // milliseconds
const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

// A copy of the mock list, so rename and delete can change it
// (it resets when the page is refreshed)
let quizzes = [...mockQuizList];

// ERROR HELPER
// Turns an axios error into a simple message the screen can show
function handleError(error) {
  const message =
       error.response?.data?.error || error.message || "Something went wrong";
  throw new Error(message);
}

// READ: get all saved quizzes
export async function getQuizzes() {
  if (USE_MOCK) {
    await wait();
    return [...quizzes];
  }
  try {
    const response = await api.get("/quizzes");
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// READ: get one quiz with its questions
export async function getQuizById(id) {
  if (USE_MOCK) {
    await wait();
    // id from the URL is a string, so convert it to a number
    const quiz = quizzes.find((q) => q.id === Number(id));
    if (!quiz) throw new Error("Quiz not found");
    // Mock data has only one set of questions, so every quiz uses them
    return { ...quiz, questions: mockQuiz.questions };
  }
  try {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// CREATE: make a new quiz from a topic or a PDF
// formData is a FormData object with: topic or file, difficulty, numQuestions
export async function createQuiz(formData) {
  if (USE_MOCK) {
    await wait();
    const topic = formData.get("topic");
       const pdf = formData.get("file");
    if (!topic && !pdf) throw new Error("Please enter a topic or upload a PDF");

    const newQuiz = {
      id: Date.now(), // simple unique id for mock data
      title: topic || pdf.name,
      topic: topic || pdf.name,
      difficulty: formData.get("difficulty"),
      numQuestions: Number(formData.get("numQuestions")),
      createdAt: new Date().toISOString(),
    };
    quizzes.push(newQuiz);
    return { ...newQuiz, questions: mockQuiz.questions };
  }
  try {
    // axios sends FormData as multipart/form-data automatically
    const response = await api.post("/quizzes", formData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE: rename a quiz
export async function renameQuiz(id, title) {
  if (USE_MOCK) {
    await wait();
    const quiz = quizzes.find((q) => q.id === Number(id));
    if (!quiz) throw new Error("Quiz not found");
    quiz.title = title;
    return { ...quiz };
  }
  try {
    const response = await api.put(`/quizzes/${id}`, { title });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// DELETE: delete a quiz
export async function deleteQuiz(id) {
  if (USE_MOCK) {
    await wait();
    const exists = quizzes.some((q) => q.id === Number(id));
    if (!exists) throw new Error("Quiz not found");
    quizzes = quizzes.filter((q) => q.id !== Number(id));
    return;
  }
  try {
    await api.delete(`/quizzes/${id}`);
  } catch (error) {
    handleError(error);
  }
}

// SUBMIT: send answers and get the result
// answers is a list like: [{ questionId: 1, selectedIndex: 2 }, ...]
export async function submitAttempt(id, answers) {
  if (USE_MOCK) {
    await wait();
    // Check the student's answers against the correct answers in mock data
    const results = mockAttemptResult.results.map((r) => {
      const answer = answers.find((a) => a.questionId === r.questionId);
      const selectedIndex = answer ? answer.selectedIndex : null;
      return { ...r, selectedIndex, isCorrect: selectedIndex === r.correctIndex };
    });
    const score = results.filter((r) => r.isCorrect).length;
    const total = results.length;
    return {
      attemptId: Date.now(),
      score,
      total,
      percentage: Math.round((score / total) * 100),
      results,
    };
  }
  try {
    const response = await api.post(`/quizzes/${id}/attempts`, { answers });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}