const Marks = require("../models/Marks");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const validateMarks = require("../utils/validateMarks");

const saveMarks = async (req, res, next) => {
  try {
    const { studentId, examType, academicYear, subjects, remarks } = req.body;

    if (!studentId || !examType || !academicYear) {
      res.status(400)
      throw new Error("Missing required fields")
    }

    const validation = validateMarks({ examType, subjects })

    if (!validation.valid) {
      res.status(400)
      throw new Error(validation.message)
    }

    const student = await Student.findById(studentId);

    if (!student) {
      res.status(404)
      throw new Error("Student not found")
    }

    if (req.user.role === "teacher") {
      const teacher = await Teacher.findById(req.user.id)

      if (!teacher) {
        res.status(404)
        throw new Error("Teacher not found")
      }

      if (!teacher.assignedClasses.includes(student.classId)) {
        res.status(403)
        throw new Error("You cannot enter marks for this class")
      }

      const invalidSubject = subjects.find(
        (subject) =>
          !teacher.assignedSubjects.includes(Number(subject.subjectId))
      )

      if (invalidSubject) {
        res.status(403)
        throw new Error(
          `You are not assigned subject ${invalidSubject.subjectId}.`
        )
      }
    }

    const marks = await Marks.findOneAndUpdate(
      {
        student: studentId,
        examType,
        academicYear
      },
      {
        student: studentId,
        examType,
        academicYear,
        subjects,
        enteredBy: req.user.id,
        enteredByRole: req.user.role,
        remarks: remarks || ""
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    )

    res.status(200).json({ message: "Marks saved successfully", marks })
  }
  catch (error) {
    next(error)
  }
}

const getMarks = async (req, res, next) => {
  try {
    const { studentId, examType, academicYear, classId } = req.query;

    const filter = {};

    if (studentId) {
      filter.student = studentId;
    }

    if (examType) {
      filter.examType = examType;
    }

    if (academicYear) {
      filter.academicYear = academicYear;
    }

    let marks = await Marks.find(filter)
      .populate("student", "studentId name classId")
      .sort({ createdAt: -1 });

    if (classId) {
      marks = marks.filter((record) => Number(record.student.classId) === Number(classId));
    }

    res.status(200).json({
      marks,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentMarks = async (req, res, next) => {

    if (req.user.role === "student" && req.user.id !== req.params.id) {
        res.status(403)
        throw new Error("You can only view your own marks")
    }
    
    try {
        const marks = await Marks.find({ student: req.params.id }).sort({ createdAt: -1 })
        res.status(200).json({ marks })
    }
    catch (error) {
        next(error)
    }
}

const getMarksById = async (req, res, next) => {
  try {
    const marks = await Marks.findById(req.params.id).populate("student")

    if (!marks) {
      res.status(404)
      throw new Error("Marks not found")
    }

    res.status(200).json({ marks })
  }
  catch (error) {
    next(error)
  }
}

const deleteMarks = async (req, res, next) => {
  try {
    const marks = await Marks.findById(req.params.id)

    if (!marks) {
      res.status(404)
      throw new Error("Marks not found")
    }

    await marks.deleteOne()
    res.status(200).json({ message: "Marks deleted successfully" })
  }
  catch (error) {
    next(error)
  }
}

module.exports = { saveMarks, getMarks, getStudentMarks, getMarksById, deleteMarks }
