const express = require("express");
const router = express.Router();
const { getAllSkills } = require("../controllers/temp");

// GET /api/skills
router.get("/", getAllSkills);

module.exports = router;