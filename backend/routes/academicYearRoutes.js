const express = require("express");

const {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  setActiveAcademicYear,
} = require("../controllers/academicYearController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin", "teacher"), getAcademicYears);
router.post("/", protect, authorize("admin"), createAcademicYear);
router.put("/:id", protect, authorize("admin"), updateAcademicYear);
router.delete("/:id", protect, authorize("admin"), deleteAcademicYear);
router.patch("/:id/activate", protect, authorize("admin"), setActiveAcademicYear);

module.exports = router;
