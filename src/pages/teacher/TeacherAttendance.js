import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase/firebase";
import { Classes } from "../../data/data";
import Navbar from "../../components/Navbar";

function TeacherAttendance() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const today = new Date().toISOString().slice(0, 10);

    async function loadData() {
        const teacherId = localStorage.getItem("teacherId");
        const teacherSnapshot = await getDocs(collection(db, "teachers"));
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

        if (teacherData && teacherData.classIds && teacherData.classIds.length > 0) {
            setSelectedClass(teacherData.classIds[0]);
        }

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
    }

    useEffect(() => {
        loadData();
    }, []);

    function isMarked(studentId) {
        return attendance.find((item) =>
                item.studentId === studentId &&
                item.date === today
        );
    }

    function getClassName(id) {
        return Classes.find((item) => item.id === Number(id))?.name || "-";
    }

    const filteredStudents = students.filter((student) => Number(student.classId) === Number(selectedClass));

    async function markAttendance(studentId, status) {
        const alreadyMarked = isMarked(studentId);
        if (alreadyMarked) {
            return;
        }

        await addDoc(collection(db, "attendance"),{
                studentId,
                date: today,
                status
            }
        );
        loadData();
    }

    if (!teacher) {
        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main">
                    <Navbar title="Mark Attendance" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                    <h2>Loading Details</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Mark Attendance" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                <div className="page-header">
                    <div>
                        <h2>Mark Attendance</h2>
                        <p>
                            Attendance for {today}
                        </p>
                    </div>
                </div>
                <div className="panel">
                    <div style={{ marginBottom: "20px" }}>
                        <label>Select Class</label>

                        <br />

                        <select value={selectedClass} onChange={(e) => setSelectedClass(Number(e.target.value))}>
                            {teacher.classIds.map((classId) => (
                                        <option key={classId} value={classId}>{getClassName(classId)}</option>
                                    )
                                )
                            }
                        </select>
                    </div>
                    {filteredStudents.length === 0 && (
                            <h3>No Students Found</h3>
                        )
                    }
                    {filteredStudents.map(
                            (student) => {
                                const result = isMarked(student.firebaseId);

                                return (
                                    <div className="attendance-row" key={student.firebaseId}>
                                        <div>
                                            <strong>{student.name}</strong>
                                            <br />
                                            <small>Student ID : {student.id}</small>
                                        </div>
                                        {result ? (
                                                <span className={`status-pill ${result.status.toLowerCase()}`}>
                                                    {result.status}
                                                </span>
                                            ) : (
                                                <div>
                                                    <button onClick={() => markAttendance(student.firebaseId,"Present")}>
                                                        Present
                                                    </button>

                                                    <button onClick={() => markAttendance(student.firebaseId,"Absent")} style={{ marginLeft: "10px" }}>
                                                        Absent
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                );
                            }
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default TeacherAttendance;
