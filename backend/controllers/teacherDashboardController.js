const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Marks = require("../models/Marks");
const Announcement = require("../models/Announcement");

const getTeacherDashboard = async (req, res, next) => {
    try {
        const teacher = await Teacher.findById(req.user.id);
        if (!teacher) {
            res.status(404);
            throw new Error("Teacher not found");
        }

        const students = await Student.find({ classId: { $in: teacher.assignedClasses }, active: true });
        const attendance = await Attendance.find({ student: { $in: students.map(student => student._id) } });
        const marks = await Marks.find({ student: { $in: students.map(student => student._id) } });
        const latestAnnouncement = await Announcement.findOne({ active: true, audience: { $in: ["All", "Teachers"] } }).sort({ createdAt: -1 });
        res.status(200).json({ teacher, students, attendance, marks, latestAnnouncement });
    }
    catch (error) {
        next(error);
    }
};

module.exports = { getTeacherDashboard }