const express = require("express");

const router = express.Router();

const { getTeacherClasses } = require("../controllers/teacherClassesController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("teacher"), getTeacherClasses);

module.exports = router;