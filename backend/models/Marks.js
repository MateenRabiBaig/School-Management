const mongoose = require("mongoose");

const subjectMarksSchema = new mongoose.Schema(
  {
    subjectId: {
      type: Number,
      required: true,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
    },

    maxMarks: {
      type: Number,
      default: 100,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const marksSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    examType: {
      type: String,
      enum: ["Test 1", "Test 2", "Test 3", "Midterm", "Final"],
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    subjects: {
      type: [subjectMarksSchema],
      validate: {
        validator(value) {
          return value.length > 0;
        },
        message: "At least one subject is required.",
      },
    },

    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    enteredByRole: {
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

marksSchema.index(
  {
    student: 1,
    examType: 1,
    academicYear: 1,
  },
  {
    unique: true,
  }
);

marksSchema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

module.exports = mongoose.model("Marks", marksSchema);
