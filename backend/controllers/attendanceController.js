const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const validateAttendance = require("../utils/validateAttendance");

const markAttendance = async (req, res, next) => {
  try {
    const { attendanceDate, records } = req.body;

    if (!attendanceDate) {
      res.status(400);
      throw new Error("Attendance date is required");
    }

    if (!Array.isArray(records) || records.length === 0) {
      res.status(400);
      throw new Error("Attendance records are required");
    }

    for (const record of records) {
      if (!record.studentId) {
        res.status(400);
        throw new Error("Student ID is required for each attendance record");
      }

      const validation = validateAttendance({ status: record.status });

      if (!validation.valid) {
        res.status(400);
        throw new Error(validation.message);
      }

      const student = await Student.findById(record.studentId);

      if (!student) {
        res.status(400);
        throw new Error(`Student not found ${record.studentId}`);
      }
    }

    const normalizedDate = new Date(attendanceDate);
    normalizedDate.setHours(0, 0, 0, 0);

    const operations = [];

    for (const record of records) {
      operations.push({
        updateOne: {
          filter: {
            student: record.studentId,
            attendanceDate: normalizedDate,
          },
          update: {
            student: record.studentId,
            attendanceDate: normalizedDate,
            status: record.status,
            markedBy: req.user.id,
            markedByRole: req.user.role,
            remarks: record.remarks || "",
          },
          upsert: true,
        },
      });
    }

    await Attendance.bulkWrite(operations);

    res.status(200).json({
      message: "Attendance saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAttendance = async (req, res, next) => {
  try {
    const { date, classId, studentId, status } = req.query;

    const filter = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      filter.attendanceDate = {
        $gte: start,
        $lte: end,
      };
    }

    if (status) {
      filter.status = status;
    }

    if (studentId) {
      filter.student = studentId;
    }

    let attendance = await Attendance.find(filter)
      .populate("student", "studentId name classId photo")
      .sort({ attendanceDate: -1 });

    if (classId) {
      attendance = attendance.filter((record) => Number(record.student.classId) === Number(classId));
    }

    res.status(200).json({
      attendance,
    });
  } catch (error) {
    next(error);
  }
};

const getTodayAttendance = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.find({
      attendanceDate: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate("student", "studentId name classId");

    res.status(200).json({
      attendance,
    });
  } catch (error) {
    next(error);
  }
};

const getStudentAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({
      student: req.params.id,
    }).sort({ attendanceDate: -1 });

    res.status(200).json({
      attendance,
    });
  } catch (error) {
    next(error);
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      res.status(404);
      throw new Error("Attendance record not found");
    }

    const validation = validateAttendance({
      status: req.body.status,
    });

    if (!validation.valid) {
      res.status(400);
      throw new Error(validation.message);
    }

    attendance.status = req.body.status;
    attendance.remarks = req.body.remarks || "";
    attendance.markedBy = req.user.id;
    attendance.markedByRole = req.user.role;

    await attendance.save();

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      res.status(404);
      throw new Error("Attendance record not found");
    }

    await attendance.deleteOne();

    res.status(200).json({
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getTodayAttendance,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance,
};
