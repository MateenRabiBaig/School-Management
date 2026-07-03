import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase/firebase";
import Navbar from "../../components/Navbar";

function TeacherDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [marks, setMarks] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const today = new Date().toISOString().slice(0, 10);

    async function loadDashboard() {
        const teacherId = localStorage.getItem("teacherId");
        const teacherSnapshot = await getDocs(
            collection(db, "teachers")
        );

        let teacherData = null;
        teacherSnapshot.forEach((doc) => {
            if (doc.id === teacherId) {
                teacherData = {
                    firebaseId: doc.id,
                    ...doc.data()
                };
            }
        });

        setTeacher(teacherData);
        const studentSnapshot = await getDocs(collection(db, "students"));
        const studentRows = [];
        studentSnapshot.forEach((doc) => {
            studentRows.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });
        setStudents(studentRows);

        const attendanceSnapshot = await getDocs(collection(db, "attendance"));
        const attendanceRows = [];
        attendanceSnapshot.forEach((doc) => {
            attendanceRows.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });

        setAttendance(attendanceRows);
        const marksSnapshot = await getDocs(
            collection(db, "marks")
        );

        const marksRows = [];
        marksSnapshot.forEach((doc) => {
            marksRows.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });

        setMarks(marksRows);
        
        const announcementSnapshot = await getDocs(collection(db, "announcements"));
        const announcementRows = [];
        announcementSnapshot.forEach((doc) => {
            announcementRows.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });
        announcementRows.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        setAnnouncements(announcementRows);
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    if (!teacher) {
        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main teacher-dashboard-main">
                    <h2>Loading Details</h2>
                </div>
            </div>
        );
    }

    const teacherStudents = students.filter(
        (student) => teacher.classIds.includes(Number(student.classId))
    );

    const todayAttendance = attendance.filter(
        (item) => item.date === today && teacherStudents.some((student) => student.firebaseId === item.studentId));

    const attendanceCompleted = teacherStudents.length > 0 && todayAttendance.length === teacherStudents.length;
    const teacherMarks = marks.filter((item) => teacher.subjectIds.includes(Number(item.subjectId)));
    const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main teacher-dashboard-main">
                <Navbar title="Dashboard" user={{ name: "Ravi Kumar", role: "Teacher" }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                <div className="page-header">
                    <div>
                        <h2>Welcome, {" "} {teacher.name}</h2>
                        <p>Teacher Dashboard</p>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Assigned Classes</h3>
                        <h1>{teacher.classIds.length}</h1>
                    </div>
                    <div className="dashboard-card">
                        <h3>Assigned Subjects</h3>
                        <h1>{teacher.subjectIds.length}</h1>
                    </div>
                    <div className="dashboard-card">
                        <h3>Total Students</h3>
                        <h1>{teacherStudents.length}</h1>
                    </div>
                    <div className="dashboard-card">
                        <h3>Today's Attendance</h3>
                        <h1>{attendanceCompleted ? "Completed" : "Pending"}</h1>
                    </div>
                    <div className="dashboard-card">
                        <h3>Marks Entered</h3>
                        <h1>{teacherMarks.length}</h1>
                    </div>
                    <div className="dashboard-card">
                        <h3>Active Status</h3>
                        <h1>{teacher.active ? "Active" : "Inactive"}</h1>
                    </div>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginTop: "30px"
                    }}
                >
                    <div className="table-card">
                        <h3>My Classes</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Students</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teacher.classIds.map((classId) => {
                                            const count = students.filter((student) => Number(student.classId) === Number(classId)).length;
                                            return (
                                                <tr key={classId}>
                                                    <td>{classId === 1 ? "10th" : classId === 2 ? "11th" : "12th"}</td>
                                                    <td>{count}</td>
                                                </tr>
                                            );
                                        }
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="table-card">
                        <h3>Latest Announcement</h3>
                        {latestAnnouncement ? (
                                <div>
                                    <h4>{latestAnnouncement.title}</h4>
                                    <p>{latestAnnouncement.message}</p>
                                    <p><strong>Type :</strong>{" "}{latestAnnouncement.type}</p>
                                    <p><strong>Date :</strong>{" "}{latestAnnouncement.createdDate}</p>
                                </div>
                            ) : (
                                <p>No announcements available.</p>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDashboard;
