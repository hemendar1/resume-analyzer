const path = require("path");
const { saveResumeMetadata, getAllResumes, extractTextFromPDF } = require("../services/uploadService");
const { detectSkills } = require("../services/skillService");
const { calculateScore } = require("../services/scoringService");

const uploadResume = async (req, res) => {
  try {
    console.log("Request received");

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    let extractedText = null;
    let skills = [];
    let score = 0;
    let extractedEmail = null;
    let extractedName = req.file.originalname; // ✅ ADDED (fallback)

    if (req.file.mimetype === "application/pdf") {
      extractedText = await extractTextFromPDF(req.file.path);

      if (!extractedText) {
        return res.status(400).json({
          success: false,
          message: "Could not extract text from PDF",
        });
      }

      // ✅ NAME EXTRACTION (ADDED)
      const lines = extractedText
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

      extractedName = lines[0];

      // ✅ EMAIL (existing logic untouched)
      const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
      const emailMatch = extractedText.match(emailRegex);
      extractedEmail = emailMatch ? emailMatch[0] : null;

      if (!extractedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email not found in resume",
        });
      }

      skills = detectSkills(extractedText).map(s => s.toLowerCase());
      score = calculateScore(skills);
    }

    const fileData = {
      originalName: extractedName, // ✅ CHANGED
      email: extractedEmail,
      resumeText: extractedText,
      skills,
      score,
      feedbackText: null,
    };

    const insertedId = await saveResumeMetadata(fileData);

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