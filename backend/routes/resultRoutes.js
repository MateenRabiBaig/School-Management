const express=require("express");
const{ getResults, getStudentResults }=require("../controllers/resultController");
const{ protect, authorize }=require("../middleware/authMiddleware");

const router=express.Router();

router.get("/", protect, authorize("admin", "teacher"), getResults)
router.get("/student/:id", protect, authorize("admin", "teacher", "student"), getStudentResults)

module.exports=router