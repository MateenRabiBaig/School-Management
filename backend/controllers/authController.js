const Admin = require("../models/Admin")
const Teacher = require("../models/Teacher")
const Student = require("../models/Student")

const generateToken = require("../utils/generateToken")

const getModelByRole = (role) => {
    const models = { admin: Admin, teacher: Teacher, student: Student}
    return models[role]
}

const getIdentifierField = (role) => {
    const fields = {
        admin: "adminId",
        teacher: "teacherId",
        student: "studentId"
    }
    return fields[role]
}

const formatUserResponse = (user, role) => {
    const userData = {
        id: user._id,
        name: user.name,
        role,
        active: user.active
    }
    
    if(role === "admin") {
        userData.adminId = user.adminId
    }

    if(role === "teacher") {
        userData.teacherId = user.teacherId
        userData.photo = user.photo
    }
    return userData
}

const login = async(req,res,next) => {
    try {
        const { userId, password, role } = req.body

        if(!userId || !password || !role) {
            res.status(400)
            throw new Error("User Id, password and role are required")
        }
        const normalizeRole = role.toLowerCase().trim()
        const Model = getModelByRole(normalizeRole)
        const identifierField = getIdentifierField(normalizeRole)

        if(!Model || !identifierField) {
            res.status(400)
            throw new Error("Invalid Role")
        }

        const user = await Model.findOne({
            [identifierField]: userId.toUpperCase().trim()
        }).select("+password")

        if(!user) {
            res.status(401)
            throw new Error("Invalid user Id or password")
        }

        if(!user.active) {
            res.status(403)
            throw new Error("Account Inactive")
        }

        const passwordMacthes = await user.comparePassword(password)
        if(!passwordMacthes) {
            res.status(401)
            throw new Error("Invalid user ID or password")
        }

        const token = generateToken(user._id,normalizeRole)
        res.status(200).json({ success: true, message: "Login Successful", token, user: formatUserResponse(user,normalizeRole) })
    }
    catch(error) {
        next(error)
    }
}

const getCurrentUser = async (req,res,next) => {
    try {
        res.status(200).json({ success: true, user: formatUserResponse(req.user, req.userRole) })
    }
    catch(error) {
        next(error)
    }
}

module.exports = { login, getCurrentUser }