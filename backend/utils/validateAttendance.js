const validateAttendance = ({ status }) => {
    const allowedStatus = ["Present", "Absent"]

    if(!allowedStatus.includes(status)) {
        return {
            valid: false,
            message: "Attendance status is invalid"
        }
    }

    return {
        valid: true
    }
}

module.exports = validateAttendance