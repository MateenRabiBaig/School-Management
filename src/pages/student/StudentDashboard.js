import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Classes, Subjects } from "../../data/data";
import getNavbarUser from "../../utils/getNavbarUser";
import { getMyStudentProfile } from "../../api/studentApi";
import { getStudentAttendance } from "../../api/attendanceApi";
import { getStudentResults } from "../../api/resultApi";

function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [student, setStudent] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navbarUser = getNavbarUser();

    async function loadDashboard() {
    
        try {
        setLoading(true);
        const profileResponse = await getMyStudentProfile();
        const currentStudent = profileResponse.student;
        setStudent(currentStudent);
        const attendanceResponse = await getStudentAttendance(currentStudent.id);
        setAttendance(attendanceResponse.attendance || []);
        const resultResponse = await getStudentResults(currentStudent.id);
        setResults(resultResponse.results || []);
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {

        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main">
                    <Navbar
                        title="Dashboard"
                        user={navbarUser}
                        onToggleSidebar={() =>
                            setSidebarOpen(prev => !prev)
                        }
                    />
                    <div className="panel">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    const presentCount = attendance.filter(item => item.status === "Present").length;
    const attendancePercentage = attendance.length ? (presentCount / attendance.length) * 100 : 0;
    const classData = Classes.find(item => item.id === student.classId);
    const subjectsCount = classData.compulsorySubjects.length + student.selectedSubjects.length;

    function getSubjectName(id) {
        const subject = Subjects.find(item => item.id === id);
        return subject?.name;
    }

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Dashboard" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                <div className="page-header">
                    <div>
                        <h2>Welcome, {" "} {student.name}</h2>
                        <p>Student Dashboard</p>
                    </div>
                </div>
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Attendance %</h3>
                        <p>{attendancePercentage.toFixed(0)}%</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Subjects</h3>
                        <p>{subjectsCount}</p>
                    </div>
                </div>

                <div className="summary-box">
                    <h3>Quick Profile</h3>
                    <p>Class : {" "} {classData.name}</p>
                    <p>Optional Subject : {" "} {getSubjectName(student.selectedSubjects[0])}</p>
                    <p>Status : {" "}{student.active ? "Active" : "Inactive"}</p>
                </div>

                <div className="summary-box">
                    <h3>Latest Marks</h3>
                    {results.slice(0,1).map(result => (result.subjects.map(subject => (
                        <p key={subject.subjectId}>{getSubjectName(subject.subjectId)} {" : "} {subject.marks}</p>
                    ))
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
