const express = require("express");
const { getTeachers, getTeacherById, getMyTeacherProfile, createTeacher, updateTeacher, deleteTeacher } = require("../controllers/teacherController");
const { protect, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/me", protect, authorize("teacher"), getMyTeacherProfile);
router.route("/").get(protect,authorize("admin"),getTeachers).post(protect,authorize("admin"),createTeacher);
router.route("/:id").get(protect,authorize("admin"),getTeacherById).put(protect,authorize("admin"),updateTeacher).delete(protect,authorize("admin"),deleteTeacher);

module.exports = router;