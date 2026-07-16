const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")
const Teacher = require("../models/Teacher")
const Student = require("../models/Student")

const protect = async(req,res,next) => {
    try {
        let token;
        const authorization = req.headers.authorization;

        if(authorization && authorization.startsWith("Bearer")) {
            token = authorization.split(" ")[1]
        }
        
        if(!token) {
            res.status(401)
            throw new Error("Authentication required")
        }

        // const decoded = jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decoded)

        // let user;

        // if(decoded.role === "admin") {
        //     user = await Admin.findById(decoded.id)
        // }
        // else if(decoded.role === "teacher") {
        //     user = await Teacher.findById(decoded.id)
        // }
        // else if(decoded.role === "student") {
        //     user = await Student.findById(decoded.id)
        // }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

console.log("Decoded:", decoded);

let user;

if (decoded.role === "admin") {
    console.log("Looking for Admin:", decoded.id);
    user = await Admin.findById(decoded.id);
}

else if (decoded.role === "teacher") {
    console.log("Looking for Teacher:", decoded.id);
    user = await Teacher.findById(decoded.id);
}

else if (decoded.role === "student") {
    console.log("Looking for Student:", decoded.id);
    user = await Student.findById(decoded.id);
}

console.log("Found user:", user);

        if(!user) {
            res.status(401)
            throw new Error("User with this token doesn't exist")
        }

        if(!user.active) {
            res.status(403)
            throw new Error("Account Inactive")
        }
        req.user = user
        req.userRole = decoded.role
        next()
    }
    catch(error) {
        if(error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            res.status(401)
            return next(new Error(error.name === "TokenExpiredError" ? "Token Expired" : "Invalid Token" ))
        }
        next(error)
    }
}

const authorize = (...allowedRoles) => {
    return (req,res,next) => {
        console.log("req.userRole =", req.userRole);
        console.log("allowedRoles =", allowedRoles);
        if(!allowedRoles.includes(req.userRole)) {
            res.status(403)
            return next(new Error("Not Authorized to Access this Resource"))
        }
        next()
    }
}

module.exports = { protect, authorize }