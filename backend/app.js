const express = require("express")
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes")
const authRoutes = require("./routes/authRoutes")
const studentRoutes = require("./routes/studentRoutes")
const teacherRoutes = require("./routes/teacherRoutes")
const attendanceRoutes = require("./routes/attendanceRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/",(req,res) => {
    res.status(200).json({ success: true, message: "School Management API" })
})

app.use("/api/health", healthRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes)
app.use("/api/teachers", teacherRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use(notFound)
app.use(errorHandler)

module.exports = app