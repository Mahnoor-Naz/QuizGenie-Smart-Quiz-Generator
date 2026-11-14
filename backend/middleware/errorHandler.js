// middleware/errorHandler.js
// Ek jagah se saari errors catch hoti hain.

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error("❌ Server error:", err.message);

  // Multer file-too-large
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large (max 5 MB)" });
  }
  if (err.message?.includes("Only PDF")) {
    return res.status(400).json({ error: err.message });
  }
  // SQLite constraint
  if (err.code === "SQLITE_CONSTRAINT") {
    // NAYA FIX: User ko saaf aur specific message dena
    return res.status(400).json({ 
      error: "Invalid data format. Please check difficulty, number of questions, or options." 
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 && process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
}