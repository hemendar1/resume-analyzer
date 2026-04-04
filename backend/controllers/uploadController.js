const path = require("path");
const { saveResumeMetadata, getAllResumes, extractTextFromPDF } = require("../services/uploadService");
const { detectSkills } = require("../services/skillService");
const { calculateScore } = require("../services/scoringService");
/**
 * POST /api/upload
 * Handles resume file upload and stores metadata in DB.
 */


const uploadResume = async (req, res) => {
  try {
    console.log("Request received");

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    console.log("File uploaded:", req.file.path);

    let extractedText = null;
    let skills = [];
    let score = 0;

    // ✅ Step 1: Extract → Skills → Score
    if (req.file.mimetype === "application/pdf") {
      console.log("Extracting text...");
      extractedText = await extractTextFromPDF(req.file.path);
      console.log("Extraction done");

      skills = detectSkills(extractedText);
      console.log("Skills extracted:", skills);

      score = calculateScore(skills);
      console.log("Score calculated:", score);
    }

    // ✅ Step 2: Now create fileData
    const fileData = {
      originalName: req.file.originalname,
      storedName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      skills,
      score,
    };

    // ✅ Step 3: Save to DB
    const insertedId = await saveResumeMetadata(fileData);
    console.log("Saved to DB");

    // ✅ Step 4: Response
    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      data: {
        id: insertedId,
        extractedText,
        skills,
        score,
      },
    });

  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const listResumes = async (req, res) => {
  try {
    const resumes = await getAllResumes();
    return res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    console.error("Fetch error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadResume, listResumes };