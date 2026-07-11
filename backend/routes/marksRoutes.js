const express = require("express");
const { saveMarks, getMarks, getStudentMarks, getMarksById, deleteMarks } = require("../controllers/marksController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, authorize("admin", "teacher"), saveMarks)
router.get("/", protect, authorize("admin", "teacher"), getMarks )
router.get("/student/:id", protect, authorize("admin", "teacher", "student"), getStudentMarks)
router.get("/:id", protect, authorize("admin", "teacher"), getMarksById)
router.delete("/:id", protect, authorize("admin"), deleteMarks)

module.exports = router;