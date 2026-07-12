const Teacher = require("../models/Teacher");
const generateEntityId = require("../utils/generateEntityId");
const validateTeacherAssignments = require("../utils/validateTeacherAssignments");

const getTeachers = async (req, res, next) => {
  try {
    const { search, active, classId, subjectId } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          teacherId: {
            $regex: search,
            $options: "i",
          },
        }
      ];
    }

    if (active === "true" || active === "false") {
      filter.active = active === "true";
    }

    if (classId) {
      filter.assignedClasses = Number(classId);
    }

    if (subjectId) {
      filter.assignedSubjects = Number(subjectId);
    }

    const teachers = await Teacher.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      teachers,
    });
  }
  catch (error) {
    next(error);
  }
};

const getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      res.status(404);
      throw new Error("Teacher not found");
    }

    res.status(200).json({ teacher });
  }
  catch (error) {
    next(error);
  }
};

const getMyTeacherProfile = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.id);

    if (!teacher) {
      res.status(404);
      throw new Error("Teacher not found");
    }

    res.status(200).json({ teacher });
  }
  catch (error) {
    next(error);
  }
};

const createTeacher = async (req, res, next) => {
  try {
    const { name, password, gender, dob, mobile, email, address, joiningDate, assignedClasses = [], assignedSubjects = [], active = true } = req.body;

    if (!name || !password) {
      res.status(400);
      throw new Error("Name and password are required");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must contain at least 6 characters");
    }

    const assignmentValidation = validateTeacherAssignments({ assignedClasses, assignedSubjects });

    if (!assignmentValidation.valid) {
      res.status(400);
      throw new Error(assignmentValidation.message);
    }

    let teacherId;
    let teacherIdExists = true;
    while (teacherIdExists) {
        teacherId = await generateEntityId("teacher", "TCH");
        teacherIdExists = await Teacher.exists({ teacherId });
    }

    const teacher = await Teacher.create({
      teacherId,
      name,
      password,
      gender: gender || null,
      dob: dob || null,
      mobile: mobile || "",
      email: email || "",
      address: address || "",
      joiningDate: joiningDate || null,
      assignedClasses: assignmentValidation.assignedClasses,
      assignedSubjects: assignmentValidation.assignedSubjects,
      active: Boolean(active),
      photo: req.body.photo || { url: "", publicId: "" }
    });

    res.status(201).json({ message: "Teacher created successfully", teacher });
  }
  catch (error) {
    next(error);
  }
};

const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("+password");

    if (!teacher) {
      res.status(404);
      throw new Error("Teacher not found");
    }

    const { name, password, gender, dob, mobile, email, address, joiningDate, assignedClasses, assignedSubjects, active } = req.body;

    if (assignedClasses !== undefined || assignedSubjects !== undefined) {
      const assignmentValidation = validateTeacherAssignments({
          assignedClasses: assignedClasses !== undefined ? assignedClasses : teacher.assignedClasses,
          assignedSubjects: assignedSubjects !== undefined ? assignedSubjects : teacher.assignedSubjects
        });

      if (!assignmentValidation.valid) {
        res.status(400);
        throw new Error(assignmentValidation.message);
      }
      teacher.assignedClasses = assignmentValidation.assignedClasses
      teacher.assignedSubjects = assignmentValidation.assignedSubjects
    }

    if (name !== undefined) {
      teacher.name = name;
    }

    if (gender !== undefined) {
      teacher.gender = gender || null;
    }

    if (dob !== undefined) {
      teacher.dob = dob || null;
    }

    if (mobile !== undefined) {
      teacher.mobile = mobile;
    }

    if (email !== undefined) {
      teacher.email = email;
    }

    if (address !== undefined) {
      teacher.address = address;
    }

    if (joiningDate !== undefined) {
      teacher.joiningDate = joiningDate || null;
    }

    if (active !== undefined) {
      teacher.active = Boolean(active);
    }

    if (password !== undefined) {
      if (password.length < 6) {
        res.status(400);
        throw new Error("Password must contain at least 6 characters");
      }
      teacher.password = password;
    }

    await teacher.save();
    const updatedTeacher = await Teacher.findById(teacher._id);

    res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
  }
  catch (error) {
    next(error);
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(
      req.params.id
    );

    if (!teacher) {
      res.status(404);
      throw new Error("Teacher not found");
    }

    await teacher.deleteOne();
    res.status(200).json({ message: "Teacher deleted successfully" });
  }
  catch (error) {
    next(error);
  }
};

module.exports = { getTeachers, getTeacherById, getMyTeacherProfile, createTeacher, updateTeacher, deleteTeacher };