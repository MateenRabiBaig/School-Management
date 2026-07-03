import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Classes, Subjects } from "../../data/data";
import Navbar from "../../components/Navbar";

function StudentDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [student, setStudent] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [marks, setMarks] = useState([]);

    async function getData() {
        const studentId = localStorage.getItem("studentId");
        const studentsData = await getDocs(collection(db, "students"));

        studentsData.forEach((doc) => {
            if (doc.id === studentId) {
                setStudent({
                    firebaseId: doc.id,
                    ...doc.data()
                });
            }
        });

        const attendanceData = await getDocs(collection(db, "attendance"));
        const tempAttendance = [];

        attendanceData.forEach((doc) => {
            const data = doc.data();
            if (data.studentId === studentId) {
                tempAttendance.push(data);
            }
        });

        setAttendance(tempAttendance);
        const marksData = await getDocs(collection(db, "marks"));
        const tempMarks = [];

        marksData.forEach((doc) => {
            const data = doc.data();
            if (data.studentId === studentId) {
                tempMarks.push(data);
            }
        });
        setMarks(tempMarks);
    }

    useEffect(() => {
        getData();
    }, []);

    if (!student) {
        return <h2>Loading...</h2>;
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
                    {marks.slice(-5).map((item,index)=>(
                        <p key={index}>{getSubjectName(item.subjectId)} {" : "} {item.marks}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;
