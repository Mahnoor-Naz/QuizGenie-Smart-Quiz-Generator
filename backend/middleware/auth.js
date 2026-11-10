// middleware/auth.js
// Simple API-key auth. Header: x-api-key: <key from .env>

export function requireApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  const expected = process.env.API_KEY;

  if (!expected) {
    return res.status(500).json({ error: "Server auth misconfigured" });
  }
  if (key !== expected) {
    return res.status(401).json({ error: "Unauthorized: invalid API key" });
  }
  next();
}