const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Attendance = require("../models/Attendance");
const calculateResult = require("../utils/calculateResults");

const getStudentResults = async (req, res, next) => {
  try {
    if (req.user.role === "student" && req.user.id !== req.params.id) {
      res.status(403);
      throw new Error("You can only view your own results.");
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      res.status(404);
      throw new Error("Student not found.");
    }

    const marks = await Marks.find({
      student: req.params.id,
    }).sort({
      createdAt: -1,
    });

    const attendanceRecords = await Attendance.find({ student: req.params.id })

    const totalAttendance = attendanceRecords.length;
    const presentAttendance = attendanceRecords.filter((record) => record.status === "Present").length

    const attendancePercentage = totalAttendance === 0 ? 0 : Number(((presentAttendance / totalAttendance) * 100).toFixed(2))

    const results = marks.map((record) => ({
      id: record.id,
      examType: record.examType,
      academicYear: record.academicYear,
      subjects: record.subjects,
      ...calculateResult(record.subjects),
    }));

    res.status(200).json({
      student: {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        classId: student.classId,
      },
      attendancePercentage,
      results,
    });
  }
  catch (error) {
    next(error);
  }
};

const getResults = async (req, res, next) => {
  try {
    const { classId, examType, academicYear } = req.query;

    const filter = {};

    if (examType) {
      filter.examType = examType;
    }

    if (academicYear) {
      filter.academicYear = academicYear;
    }

    let results = await Marks.find(filter).populate("student", "studentId name classId");

    if (classId) {
      results = results.filter(
        (record) => Number(record.student.classId) === Number(classId)
      );
    }

    if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id);

      results = results.filter((record) =>
        teacher.assignedClasses.includes(record.student.classId)
      );
    }

    results = results.map((record) => ({
      ...record.toJSON(),
      ...calculateResult(record.subjects),
    }));

    res.status(200).json({
      results,
    });
  }
  catch (error) {
    next(error);
  }
};

const getResultById = async (req, res, next) => {
    try {
        const result = await Marks.findById(req.params.id).populate("student", `
                studentId
                name
                classId
                photo
                gender
                dob
                parentName
                parentContact
                mobile
                address
                `
            );

        if (!result) {
            res.status(404);
            throw new Error("Result not found.");
        }

        const attendance = await Attendance.find({ student: result.student._id })
        const present = attendance.filter(item => item.status === "Present").length
        const attendancePercentage = attendance.length === 0 ? 0 : Number((present / attendance.length) * 100).toFixed(2);
        res.status(200).json({
            result: { ...result.toJSON(), attendancePercentage, ...calculateResult(result.subjects) }
        });
    }
    catch (error) {
        next(error)
    }
}

module.exports = { getResults, getStudentResults, getResultById }
