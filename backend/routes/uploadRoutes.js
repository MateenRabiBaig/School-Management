const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadImage } = require("../controllers/uploadController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("admin", "teacher", "student"), upload.single("image"), uploadImage)

module.exports = router