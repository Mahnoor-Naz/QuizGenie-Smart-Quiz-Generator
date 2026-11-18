
// middleware/errorHandler.js
// Ek jagah se saari errors catch hoti hain.

export function notFound(req, res) {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  // Multer file-too-large
  if (err.code === "LIMIT_FILE_SIZE") {
    status = 413;
    message = "File too large (max 5 MB)";
  }

  // Only PDF files are allowed
  else if (err.message?.includes("Only PDF")) {
    status = 400;
    message = err.message;
  }

  // SQLite constraint
  else if (err.code === "SQLITE_CONSTRAINT") {
    status = 400;
    message =
      "Invalid data format. Please check difficulty, number of questions, or options.";
  }

  // Only log actual server errors (500 and above)
  if (status >= 500) {
    console.error("❌ Server error:", err.message);
  }

  res.status(status).json({
    error:
      status === 500 && process.env.NODE_ENV === "production"
        ? "Server error"
        : message,
  });
}
