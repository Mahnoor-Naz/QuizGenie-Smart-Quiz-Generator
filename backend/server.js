// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

app.use("/api/quizzes", quizRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Backend:  http://localhost:${PORT}`);
  console.log(`   Health:   http://localhost:${PORT}/api/health`);
  console.log(`   CORS:     ${CORS_ORIGIN}`);
  console.log(`   API key:  ${process.env.API_KEY ? "loaded ✓" : "MISSING ✗"}`);
});