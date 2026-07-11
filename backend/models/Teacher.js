const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const teacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },

    dob: {
      type: Date,
      default: null,
    },

    mobile: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    joiningDate: {
      type: Date,
      default: null,
    },

    assignedClasses: {
      type: [Number],
      default: [],
    },

    assignedSubjects: {
      type: [Number],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },

    photo: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

teacherSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

teacherSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword,this.password);
  };

teacherSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("Teacher",teacherSchema);