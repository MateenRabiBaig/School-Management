const express=require("express");
const{ getResults, getStudentResults, getResultById }=require("../controllers/resultController");
const{ protect, authorize }=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/", protect, authorize("admin", "teacher"), getResults)
router.get("/student/:id", protect, authorize("admin", "teacher", "student"), getStudentResults)
router.get("/:id", protect, authorize("admin", "teacher"), getResultById)

module.exports=router
