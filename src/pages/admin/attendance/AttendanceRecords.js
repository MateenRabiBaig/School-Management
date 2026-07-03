import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../../../components/Sidebar";
import { db } from "../../../firebase/firebase";
import Navbar from "../../../components/Navbar";

function AttendanceRecords() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);

  async function loadData() {
    const attendanceSnapshot = await getDocs(collection(db, "attendance"));
    const studentSnapshot = await getDocs(collection(db, "students"));
    const attendanceRows = [];
    const studentRows = [];

    attendanceSnapshot.forEach((item) => attendanceRows.push({ firebaseId: item.id, ...item.data() }));
    studentSnapshot.forEach((item) => studentRows.push({ firebaseId: item.id, ...item.data() }));

    setRecords(attendanceRows);
    setStudents(studentRows);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Attendance Records" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Attendance Records</h2>
            <p>All stored attendance entries</p>
          </div>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => {
                const student = students.find((item) => item.firebaseId === record.studentId);
                return (
                  <tr key={record.firebaseId}>
                    <td>{student?.name || "-"}</td>
                    <td>{record.date}</td>
                    <td>{record.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceRecords;
