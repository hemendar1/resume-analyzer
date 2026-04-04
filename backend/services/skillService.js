/**
 * Predefined skills list to match against resume text.
 * Extend this array to support more skills without changing any logic.
 */
const PREDEFINED_SKILLS = [
    "java",
    "python",
    "sql",
    "react",
    "node",
    "mongodb",
    "communication",
    "teamwork",
  ];
  
  /**
   * Detects skills from resume text by matching against the predefined skills list.
   * @param {string} resumeText - Plain text extracted from a resume
   * @returns {string[]} - Array of matched skills (lowercase, deduplicated)
   * @throws {Error} - If resumeText is not a non-empty string
   */
  const detectSkills = (resumeText) => {
    if (!resumeText || typeof resumeText !== "string") {
      throw new Error("resumeText must be a non-empty string.");
    }
  
    const normalizedText = resumeText.toLowerCase();
  
    const detectedSkills = PREDEFINED_SKILLS.filter((skill) =>
      // Use word-boundary regex so "java" doesn't match inside "javascript"
      new RegExp(`\\b${skill}\\b`).test(normalizedText)
    );
  
    return detectedSkills;
  };
  
  module.exports = { detectSkills, PREDEFINED_SKILLS };