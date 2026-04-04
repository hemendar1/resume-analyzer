/**
 * Skill categories with per-skill points and a category score cap.
 */
const SKILL_CATEGORIES = {
  programming: {
    skills: ["java", "python", "c++", "c#", "typescript", "kotlin", "swift"],
    pointsPerSkill: 10,
    cap: 30,
  },
  web: {
    skills: ["react", "node", "angular", "vue", "html", "css", "javascript"],
    pointsPerSkill: 8,
    cap: 24,
  },
  database: {
    skills: ["sql", "mongodb", "postgresql", "mysql", "redis"],
    pointsPerSkill: 8,
    cap: 16,
  },
  tools: {
    skills: ["git", "docker", "kubernetes", "jenkins", "aws", "linux"],
    pointsPerSkill: 5,
    cap: 15,
  },
  soft: {
    skills: ["communication", "teamwork", "leadership", "problem-solving", "adaptability"],
    pointsPerSkill: 3,
    cap: 15,
  },
};

/**
 * Calculates a weighted resume score from detected skills.
 */
const calculateScore = (detectedSkills) => {
  if (!Array.isArray(detectedSkills)) {
    throw new Error("detectedSkills must be an array.");
  }

  const skillSet = new Set(detectedSkills.map((s) => s.toLowerCase()));

  const total = Object.values(SKILL_CATEGORIES).reduce((sum, category) => {
    const raw = category.skills
      .filter((skill) => skillSet.has(skill))
      .length * category.pointsPerSkill;

    return sum + Math.min(raw, category.cap);
  }, 0);

  return Math.round(total);
};

module.exports = { calculateScore, SKILL_CATEGORIES };