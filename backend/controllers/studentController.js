const Student = require("../models/Student")

const generateEntityId = require("../utils/generateEntityId")

const { getClassById, getStudentSubjectIds, validateStudentAcademicData } = require("../services/studentService")

const formatStudentResponse = (student) => {
    const classItem = getClassById(student.classId)

    return {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        classId: student.classId,
        className: classItem ? classItem.name : null,
        selectedSubjects: student.selectedSubjects,
        subjectIds: getStudentSubjectIds(student),
        photo: student.photo,
        gender: student.gender,
        dob: student.dob,
        mobile: student.mobile,
        parentName: student.parentName,
        parentContact: student.parentContact,
        address: student.address,
        admissionDate: student.admissionDate,
        active: student.active,
        role: student.role,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
    }
}

const createStudent = async(req,res,next) => {
    try {
        const { studentId, name, password, classId, selectedSubjects, gender, dob, mobile, parentName, parentContact, address, admissionDate, active } = req.body

        if(!name || !password || !classId) {
            res.status(400)
            throw new Error("Name, password and class are required")
        }

        if(password.length < 6) {
            res.status(400)
            throw new Error("Password must contain atleast 6 characters")
        }

        const academicValidation = validateStudentAcademicData(classId,selectedSubjects || [])

        if(!academicValidation.valid) {
            res.status(400)
            throw new Error(academicValidation.message)
        }

        // const student = await Student.create({studentId,name,password,classId: Number(classId),selectedSubjects: academicValidation.selectedSubjects,gender,dob: dob || undefined,mobile,parentName,parentContact,address,admissionDate: admissionDate || undefined,active: typeof active === "boolean" ? active : true})
        const generatedStudentId = await generateEntityId("student", "STU");

        const student = await Student.create({
            studentId: generatedStudentId,
            name,
            password,
            classId: Number(classId),
            selectedSubjects: academicValidation.selectedSubjects,
            gender,
            dob: dob || undefined,
            mobile,
            parentName,
            parentContact,
            address,
            admissionDate: admissionDate || undefined,
            active: typeof active === "boolean" ? active : true
        });
        res.status(201).json({ success: true, message: "Student created successfully", student: formatStudentResponse(student)});
    }
    catch(error) {
        next(error)
    }
}

const getStudents = async(req,res,next) => {
    try {
        const {search, classId, active} = req.query
        const filter = {}

        if(search && search.trim()) {
            const searchValue = search.trim()
            filter.$or = [
                {name: { $regex: searchValue, $options: "i" }}
            ]
        }

        if(classId) {
            filter.classId = Number(classId)
        }

        if(active === "true" || active === "false") {
            filter.active = active === "true"
        }

        const students = await Student.find(filter).sort({createdAt: -1})
        res.status(200).json({ success: true, const: students.length, students: students.map(formatStudentResponse) })
    }
    catch(error) {
        next(error)
    }
}

const getStudentById = async(req,res,next) => {
    try {
        const student = await Student.findById(req.params.id)
        if(!student) {
            res.status(404)
            throw new Error("Student not found")
        }
        res.status(200).json({ success: true, student: formatStudentResponse(student) })
    }
    catch(error) {
        next(error)
    }
}

const getMyStudentProfile = async(req,res,next) => {
    try {
        res.status(200).json({ success: true, student: formatStudentResponse(req.user) })
    }
    catch(error) {
        next(error)
    }
}

const updateStudent = async(req,res,next) => {
    try {
        const student = await Student.findById(req.params.id).select("+password")

        if(!student) {
            res.status(404)
            throw new Error("Student not found")
        }
        const nextClassId = req.body.classId!==undefined ? Number(req.body.classId) : student.classId
        const nextSelectedSubjects = req.body.selectedSubjects!== undefined ? req.body.selectedSubjects : student.selectedSubjects
        const academicValidation = validateStudentAcademicData(nextClassId,nextSelectedSubjects)

        if(!academicValidation.valid) {
            res.status(400)
            throw new Error(academicValidation.message)
        }

        if(req.body.password!==undefined && req.body.password.length < 6) {
            res.status(400)
            throw new Error("Password must contain atleast 6 characters")
        }

        const allowedFields = [ "name", "gender", "dob", "mobile", "parentName", "parentContact", "address", "admissionDate", "active" ]
        allowedFields.forEach((field) => {
            if(req.body[field]!==undefined) {
                student[field] = req.body[field]
            }
        })
        student.classId = nextClassId
        student.selectedSubjects = academicValidation.selectedSubjects

        if(req.body.password!==undefined) {
            student.password = req.body.password
        }
        await student.save()
        res.status(200).json({ success: true, message: "Student updated successfully", student: formatStudentResponse(student) })
    }
    catch(error) {
        next(error)
    }
}

const deleteStudent = async(req,res,next) => {
    try {
        const student = await Student.findById(req.params.id)

        if(!student) {
            res.status(404)
            throw new Error("Student not found")
        }

        await student.deleteOne()
        res.status(200).json({ success: true, message: "Student deleted successfully" })
    }
    catch(error) {
        next(error)
    }
}

module.exports = { createStudent, getStudents, getStudentById, getMyStudentProfile, updateStudent, deleteStudent }