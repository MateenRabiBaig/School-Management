const express=require("express");

const router=express.Router();

const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin", "teacher", "student"), getAnnouncements);
router.post("/", protect, authorize("admin"), createAnnouncement);
router.put("/:id", protect, authorize("admin"), updateAnnouncement);
router.delete("/:id", protect, authorize("admin"), deleteAnnouncement);

module.exports = router;