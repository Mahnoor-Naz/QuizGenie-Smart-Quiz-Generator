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
    return res.status(400).json({ error: "Invalid data" });
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Server error" : err.message,
  });
}
