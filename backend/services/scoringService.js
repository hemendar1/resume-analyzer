/**
 * Points awarded per detected skill.
 */
const POINTS_PER_SKILL = 10;

/**
 * Maximum achievable score, regardless of skill count.
 */
const MAX_SCORE = 100;

/**
 * Calculates a resume score based on detected skills.
 * @param {string[]} detectedSkills - Array of matched skills from skillService
 * @returns {number} - Final score, capped at MAX_SCORE
 * @throws {Error} - If detectedSkills is not an array
 */
const calculateScore = (detectedSkills) => {
  if (!Array.isArray(detectedSkills)) {
    throw new Error("detectedSkills must be an array.");
  }

  const rawScore = detectedSkills.length * POINTS_PER_SKILL;

  return Math.min(rawScore, MAX_SCORE);
};

module.exports = { calculateScore, POINTS_PER_SKILL, MAX_SCORE };