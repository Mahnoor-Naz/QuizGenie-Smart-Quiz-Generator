// services/pdfService.js
import fs from "fs";
import pdfParse from "pdf-parse";

export async function extractTextFromPdf(filePath, maxChars = 8000) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  const text = (data.text || "").trim();
  if (!text) throw new Error("PDF has no readable text");
  return text.slice(0, maxChars);
}