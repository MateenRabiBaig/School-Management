const express = require("express");
const router = express.Router();

const { getTeacherDashboard } = require("../controllers/teacherDashboardController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("teacher"), getTeacherDashboard);

module.exports = router;