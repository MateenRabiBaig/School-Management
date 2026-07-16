const Teacher = require("../models/Teacher");

const getTeacherClasses = async (req, res, next) => {
    try {
        const teacher = await Teacher.findById(req.user.id);
        if (!teacher) {
            res.status(404);
            throw new Error("Teacher not found");
        }
        res.status(200).json({ assignedClasses: teacher.assignedClasses, assignedSubjects: teacher.assignedSubjects });
    }
    catch (error) {
        next(error);
    }
};

module.exports = { getTeacherClasses }