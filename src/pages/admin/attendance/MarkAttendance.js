import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Sidebar from "../../../components/Sidebar";
import { db } from "../../../firebase/firebase";
import Navbar from "../../../components/Navbar";
import { toast } from "react-toastify";

function MarkAttendance() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [marked, setMarked] = useState([]);
  const today = new Date().toISOString().slice(0, 10);

  async function loadData() {
    try {
      const studentSnapshot = await getDocs(collection(db, "students"));
      const attendanceSnapshot = await getDocs(collection(db, "attendance"));
      const studentRows = [];
      const attendanceRows = [];

      studentSnapshot.forEach((item) => studentRows.push({ firebaseId: item.id, ...item.data() }));
      attendanceSnapshot.forEach((item) => attendanceRows.push({ firebaseId: item.id, ...item.data() }));

      setStudents(studentRows);
      setMarked(attendanceRows);
    } catch (error) {
      toast.error("Error loading data: " + error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function isMarked(studentId) {
    return marked.find((item) => item.studentId === studentId && item.date === today);
  }

  async function markAttendance(studentId, status) {
    try {
      await addDoc(collection(db, "attendance"), {
        studentId,
        date: today,
        status,
      });
      const student = students.find(s => s.firebaseId === studentId);
      toast.success(`Marked ${student?.name || 'student'} as ${status}`);
      loadData();
    } catch (error) {
      toast.error("Error marking attendance: " + error.message);
    }
  }

  return (
    <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Mark Attendance" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Mark Attendance</h2>
            <p>Attendance for {today}</p>
          </div>
        </div>

        <div className="panel">
          {students.map((student) => {
            const result = isMarked(student.firebaseId);
            return (
              <div className="attendance-row" key={student.firebaseId}>
                <span>{student.name}</span>
                {result ? (
                  <span className={`status-pill ${result.status.toLowerCase()}`}>{result.status}</span>
                ) : (
                  <div>
                    <button onClick={() => markAttendance(student.firebaseId, "Present")}>Present</button>
                    <button onClick={() => markAttendance(student.firebaseId, "Absent")}>Absent</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;
