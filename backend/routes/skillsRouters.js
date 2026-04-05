const express = require("express");
const router = express.Router();
const { getAllSkills } = require("../controllers/Skillscontroller");

// GET /api/skills
router.get("/", getAllSkills);

module.exports = router;