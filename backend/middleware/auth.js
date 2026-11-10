// middleware/auth.js
// Simple API-key auth. Header: x-api-key: <key from .env>

export function requireApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  const expected = process.env.API_KEY;

  if (!expected) {
    console.warn("⚠️ API_KEY not set: auth check skipped (development only)");
    return next();
  }
  if (key !== expected) {
    return res.status(401).json({ error: "Unauthorized: invalid API key" });
  }
  next();
}