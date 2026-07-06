const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const teacherAssignmentSchema = new mongoose.Schema(
    {
        classId: {
            type: Number,
            required: true
        },
        subjectIds: {
            type: [Number],
            default: [],
        }
    },
    {
        _id: false
    }
)

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
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        mobile: {
            type: String,
            trim: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"]
        },
        assignments: {
            type: [teacherAssignmentSchema],
            default: []
        },
        photo: {
            url: {
                type: String,
                default: ""
            },
            publicId: {
                type: String,
                default: ""
            }
        },
        active: {
            type: Boolean,
            default: true
        },
        joiningDate: {
            type: Date
        },
        role: {
            type: String,
            enum: ["teacher"],
            default: "teacher",
            immutable: true
        }
    },
    {
        timestamps: true
    }
)

teacherSchema.pre("save", async function () {
    if(!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)   
})

teacherSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword,this.password)
}

const Teacher = mongoose.model("Teacher",teacherSchema)

module.exports = Teacher