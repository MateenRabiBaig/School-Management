import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Classes } from "../../data/data";
import { getTeacherDashboard } from "../../api/teacherApi";
import getNavbarUser from "../../utils/getNavbarUser";

function TeacherDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [marks, setMarks] = useState([]);
    const [latestAnnouncement, setLatestAnnouncement] = useState(null);
    const navbarUser = getNavbarUser();
    const today = new Date().toISOString().slice(0, 10);

    async function loadDashboard() {
        try {
            setLoading(true);
            const response = await getTeacherDashboard();
            setTeacher(response.teacher);
            setStudents(response.students || []);
            setAttendance(response.attendance || []);
            setMarks(response.marks || []);
            setLatestAnnouncement(response.latestAnnouncement || null);
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
                        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                    />
                
                    <div className="panel">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    const teacherStudents = students;
    const todayAttendance = attendance.filter(item => item.attendanceDate ?.slice(0, 10) === today);
    const attendanceCompleted = teacherStudents.length > 0 && todayAttendance.length >= teacherStudents.length;
    const teacherMarks = marks;

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main teacher-dashboard-main">
                <Navbar
                    title="Dashboard"
                    user={navbarUser}
                    onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                />
                <div className="page-header">
                    <div>
                        <h2>Welcome, {" "} {teacher.name}</h2>
                        <p>Teacher Dashboard</p>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Assigned Classes</h3>
                        <h1>{teacher.assignedClasses.length}</h1>
                    </div>
                    <div className="dashboard-card">
                        <h3>Assigned Subjects</h3>
                        <h1>{teacher.assignedSubjects.length}</h1>
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
                                teacher.assignedClasses.map(classId => {
                                    const classData = Classes.find(item => Number(item.id) === Number(classId));
                                    const totalStudents = students.filter(student => Number(student.classId) === Number(classId)).length;
                                    return (
                                        <tr key={classId}>
                                            <td>{classData?.name}</td>
                                            <td>{totalStudents}</td>
                                        </tr>
                                    );
                                })
                            </tbody>
                        </table>
                    </div>
                    <div className="table-card">
                        <h3>Latest Announcement</h3>
                        {latestAnnouncement ? (
                                <div>
                                    <h4>{latestAnnouncement.title}</h4>
                                    <p>{latestAnnouncement.description}</p>
                                    <p><strong>Type :</strong>{" "}{latestAnnouncement.audience}</p>
                                    <p><strong>Date :</strong>{" "}{new Date(latestAnnouncement.createdAt).toLocaleDateString()}</p>
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
