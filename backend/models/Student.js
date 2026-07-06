const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const studentSchema = new mongoose.Schema(
    {
        studentId: {
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
        classId: {
            type: Number,
            required: true
        },
        selectedSubjects: {
            type: [Number],
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
            },
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"]
        },
        dob: {
            type: Date
        },
        mobile: {
            type: String,
            trim: true
        },
        parentName: {
            type: String,
            trim: true
        },
        parentContact: {
            type: String,
            trim: true
        },
        address: {
            type: String,
            trim: true
        },
        admissionDate: {
            type: Date,
        },
        role: {
            type: String,
            name: ["student"],
            default: "student",
            immutable: true
        },
        active: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true
    }
)

studentSchema.pre("save", async function () {
    if(!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)    
})

studentSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword,this.password)    
}

const Student = mongoose.model("Student",studentSchema)

module.exports = Student