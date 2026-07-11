import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getStudentAttendance } from "../../api/attendanceApi";
import { toast } from "react-toastify";
import getNavbarUser from "../../utils/getNavbarUser";

function MyAttendance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const navbarUser = getNavbarUser();
  const userId = navbarUser?.id;

  useEffect(() => {
    async function loadAttendance() {
      if (!userId) {
        return;
      }

      try {
        const response = await getStudentAttendance(userId);
        setAttendance(response.attendance || []);
      }
      catch (error) {
        toast.error("Error loading attendance: " + error.message);
      }
    }

    loadAttendance();
  }, [userId]);

  const presentCount = attendance.filter((item) => item.status === "Present").length;
  const attendancePercentage = attendance.length ? (presentCount / attendance.length) * 100 : 0;

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main">
        <Navbar title="My Attendance" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>My Attendance</h2>
            <p>Attendance {attendancePercentage.toFixed(0)}%</p>
          </div>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((item) => (
                <tr key={item.id}>
                  <td>{item.attendanceDate ? String(item.attendanceDate).slice(0, 10) : "-"}</td>
                  <td>{item.status}</td>
                  <td>{item.remarks || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyAttendance;