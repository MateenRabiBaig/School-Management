const express = require("express");

const {
  markAttendance,
  getAttendance,
  getTodayAttendance,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("admin", "teacher"), markAttendance);
router.get("/", protect, authorize("admin", "teacher"), getAttendance);
router.get("/today", protect, authorize("admin", "teacher"), getTodayAttendance);
router.get("/student/:id", protect, authorize("admin", "teacher", "student"), getStudentAttendance);
router.put("/:id", protect, authorize("admin", "teacher"), updateAttendance);
router.delete("/:id", protect, authorize("admin"), deleteAttendance);

module.exports = router;
