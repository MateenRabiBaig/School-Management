const express = require("express")

const { createStudent, getStudents, getStudentById, getMyStudentProfile, updateStudent, deleteStudent } = require("../controllers/studentController")
const { protect, authorize } = require("../middleware/authMiddleware")
const router = express.Router()
router.use(protect)

router.get("/me",authorize("student"),getMyStudentProfile)
router.route("/").get(authorize("admin", "teacher"),getStudents).post(authorize("admin"),createStudent)
router.route("/:id").get(authorize("admin"),getStudentById).put(authorize("admin"),updateStudent).delete(authorize("admin"),deleteStudent)

module.exports = router