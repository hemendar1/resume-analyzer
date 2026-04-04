const fs = require("fs").promises;
const pdfParse = require("pdf-parse");
const db = require("../config/db");

/**
 * Reads a PDF file from disk and extracts its text content.
 * @param {string} filePath - Absolute path to the uploaded PDF (req.file.path)
 * @returns {Promise<string>} - Extracted plain text
 * @throws {Error} - Descriptive error for missing file, bad path, or parse failure
 */
const extractTextFromPDF = async (filePath) => {
  if (!filePath) {
    throw new Error("filePath is required to extract text from PDF.");
  }

  // Read file asynchronously — throws if path does not exist
  let fileBuffer;
  try {
    fileBuffer = await fs.readFile(filePath);
  } catch (err) {
    throw new Error(`Failed to read file at "${filePath}": ${err.message}`);
  }

  // Parse PDF buffer — throws if file is corrupt or not a valid PDF
  let parsed;
  try {
    parsed = await pdfParse(fileBuffer);
  } catch (err) {
    throw new Error(`Failed to parse PDF at "${filePath}": ${err.message}`);
  }

  const extractedText = parsed.text.trim();

  if (!extractedText) {
    throw new Error(
      "PDF parsed successfully but no text was found. " +
        "The file may be image-based (scanned) or empty."
    );
  }

  return extractedText;
};

/**
 * Saves resume file metadata to the database.
 * @param {Object} fileData - { originalName, storedName, filePath, mimeType, size }
 * @returns {Promise<number>} - Inserted record ID
 */
const saveResumeMetadata = async (fileData) => {
  const {
    originalName,
    storedName,
    filePath,
    mimeType,
    size,
    skills,
    score,
  } = fileData;

  // Validate
  if (!Array.isArray(skills)) {
    throw new Error("fileData.skills must be an array.");
  }

  if (typeof score !== "number" || isNaN(score) || score < 0) {
    throw new Error("fileData.score must be a non-negative number.");
  }

  const skillsString = skills.join(",");

  const [result] = await db.execute(
    `INSERT INTO resumes
     (original_name, stored_name, file_path, mime_type, size, skills, score, uploaded_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [originalName, storedName, filePath, mimeType, size, skillsString, score]
  );

  return result.insertId;
};

/**
 * Fetches all uploaded resumes from the database.
 * @returns {Promise<Array>}
 */
const getAllResumes = async () => {
  const [rows] = await db.execute(
    `SELECT id, original_name, file_path, mime_type, size, skills, score, uploaded_at
     FROM resumes ORDER BY uploaded_at DESC`
  );
  return rows;
};

module.exports = { extractTextFromPDF, saveResumeMetadata, getAllResumes };