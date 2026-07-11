const mongoose = require("mongoose")

const attendanceSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        attendanceDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["Present", "Absent"],
            required: true,
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        markedByRole: {
            type: String,
            enum: ["admin", "teacher"],
            required: true,
        },
        remarks: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index(
  {
    student: 1,
    attendanceDate: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
