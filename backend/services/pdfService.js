// services/pdfService.js
import fs from "fs";
import pdfParse from "pdf-parse";

export async function extractTextFromPdf(filePath, maxChars = 8000) {
  const buffer = fs.readFileSync(filePath);

  let data;
  try {
    data = await pdfParse(buffer);
  } catch {
    const err = new Error("Could not read this PDF. It may be damaged or password-protected.");
    err.status = 400;
    throw err;
  }

  const text = (data.text || "").trim();
  if (!text) {
    const err = new Error("PDF has no readable text");
    err.status = 400;
    throw err;
  }
  return text.slice(0, maxChars);
}