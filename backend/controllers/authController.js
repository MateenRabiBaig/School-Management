const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const generateToken = require("../utils/generateToken");

const login = async (req, res, next) => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      res.status(400);
      throw new Error("User ID, password, and role are required");
    }

    let user;

    if (role === "admin") {
      user = await Admin.findOne({ adminId: userId.toUpperCase() }).select("+password");
    }
    else if (role === "student") {
      user = await Student.findOne({ studentId: userId.toUpperCase() }).select("+password");
    }
    else if (role === "teacher") {
      user = await Teacher.findOne({ teacherId: userId.toUpperCase() }).select("+password");
    }
    else {
      res.status(400);
      throw new Error("Invalid role");
    }

    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    if (user.active === false) {
      res.status(403);
      throw new Error("Your account is inactive");
    }

    const token = generateToken(user._id, role);

    const responseUser = { id: user._id, name: user.name, role, active: user.active };

    if (role === "admin") {
      responseUser.adminId = user.adminId;
    }

    if (role === "student") {
      responseUser.studentId = user.studentId;
      responseUser.photo = user.photo;
    }

    if (role === "teacher") {
      responseUser.teacherId = user.teacherId;
      responseUser.photo = user.photo;
    }

    res.status(200).json({ token, user: responseUser });
  }
  catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    let user;

    if (req.user.role === "admin") {
      user = await Admin.findById(req.user.id);
    }
    else if (req.user.role === "student") {
      user = await Student.findById(req.user.id);
    }
    else if (req.user.role === "teacher") {
      user = await Teacher.findById(req.user.id);
    }

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({ user: {...user.toJSON(), role: req.user.role} });
  }
  catch (error) {
    next(error);
  }
};

module.exports = { login, getMe };