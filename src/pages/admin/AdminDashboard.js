import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Classes } from "../../data/data";
import Navbar from "../../components/Navbar";

function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);

    async function getData() {
        const studentsData = await getDocs(collection(db, "students"));
        const attendanceData = await getDocs(collection(db, "attendance"));
        const tempStudents = [];
        const tempAttendance = [];

        studentsData.forEach((doc) => { tempStudents.push(doc.data()) });
        attendanceData.forEach((doc) => { tempAttendance.push(doc.data()) });
        setStudents(tempStudents);
        setAttendance(tempAttendance);
    }

    useEffect(() => {
        getData();
    }, []);

    const today = new Date().toISOString().slice(0, 10);
    const normalizeDate = (value) => {
        if (!value) return "";
        return new Date(value).toISOString().slice(0, 10);
    };

    const todayAttendance = attendance.filter(item => normalizeDate(item.date) === today);
    const presentCount = todayAttendance.filter(item => item.status === "Present").length;
    const absentCount = todayAttendance.filter(item => item.status === "Absent").length;

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Admin Dashboard" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                <h2>Admin Dashboard</h2>
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Total Students</h3>
                        <p>{students.length}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Present Today</h3>
                        <p>{presentCount}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Absent Today</h3>
                        <p>{absentCount}</p>
                    </div>

                    <div className="dashboard-card">
                        <h3>Classes Count</h3>
                        <p>{Classes.length}</p>
                    </div>
                </div>

                <div className="summary-box">
                    <h3>Attendance Summary</h3>
                    <p>Present : {" "} {presentCount}</p>
                    <p>Absent : {" "}{absentCount}</p>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
