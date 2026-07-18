import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getStudentAttendance } from "../../api/attendanceApi";
import { toast } from "react-toastify";
import getNavbarUser from "../../utils/getNavbarUser";
import { useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function MyAttendance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const navbarUser = getNavbarUser();
  const userId = navbarUser?.id;
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // const presentCount = attendance.filter((item) => item.status === "Present").length;
  // const attendancePercentage = attendance.length ? (presentCount / attendance.length) * 100 : 0;
  const [selectedMonth, setSelectedMonth] = useState("All");
  const filteredAttendance = useMemo(() => {
    if (selectedMonth === "All") {
      return attendance;
    }

    return attendance.filter(item => {
      const month = new Date(item.attendanceDate).toLocaleString("default", { month: "long" });
      return month === selectedMonth;
    });
  }, [attendance, selectedMonth]);
  
  const presentCount = filteredAttendance.filter(item => item.status === "Present").length;
  const absentCount = filteredAttendance.length - presentCount;
  const attendancePercentage = filteredAttendance.length === 0 ? 0 : (presentCount / filteredAttendance.length) * 100;
  const months = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const attendanceMap = useMemo(() => {
        const map = {};
        attendance.forEach(item => {
            const date = new Date(item.attendanceDate).toISOString().split("T")[0];
            map[date] = item.status;
        });
        return map;
    }, [attendance]);

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

        <div className="dashboard-grid">

    <div className="dashboard-card">

        <h3>Total Days</h3>

        <h2>

            {filteredAttendance.length}

        </h2>

    </div>

    <div className="dashboard-card">

        <h3>Present</h3>

        <h2>

            {presentCount}

        </h2>

    </div>

    <div className="dashboard-card">

        <h3>Absent</h3>

        <h2>

            {absentCount}

        </h2>

    </div>

    <div className="dashboard-card">

        <h3>Attendance</h3>

        <h2>

            {attendancePercentage.toFixed(1)}%

        </h2>

    </div>

</div>

{/* <div className="table-card">

    <table>

        <thead>

            <tr>

                <th>Date</th>

                <th>Status</th>

                <th>Remarks</th>

            </tr>

        </thead>

        <tbody>

            {filteredAttendance.length === 0 ? (

                <tr>

                    <td
                        colSpan={3}
                        style={{
                            textAlign: "center"
                        }}
                    >

                        No attendance found.

                    </td>

                </tr>

            ) : (

                filteredAttendance.map(item => (

                    <tr key={item.id}>

                        <td>

                            {item.attendanceDate
                                ? new Date(
                                      item.attendanceDate
                                  ).toLocaleDateString()
                                : "-"}

                        </td>

                        <td>

                            <span

                                className={`badge ${
                                    item.status === "Present"
                                        ? "active"
                                        : "inactive"
                                }`}

                            >

                                {item.status}

                            </span>

                        </td>

                        <td>

                            {item.remarks || "-"}

                        </td>

                    </tr>

                ))

            )}

        </tbody>

    </table>
    </div> */}
    <Calendar value={selectedDate} onChange={setSelectedDate} tileContent={({ date }) => {
        const key = date.toISOString().split("T")[0];
        const status = attendanceMap[key];
        
        if (status === "Present") {
            return (
                <div className="attendance-dot present" />
            );
        }
        
        if (status === "Absent") {
            return (
                <div className="attendance-dot absent" />
            );
        }
        return null;
    }}
    tileClassName={({ date }) => {
        const key = date.toISOString().split("T")[0];
        if (attendanceMap[key] === "Present") {
            return "attendance-present";
        }
        if (attendanceMap[key] === "Absent") {
            return "attendance-absent";
        }
        return "";
    }}
    />

    <div className="attendance-legend">
        <div><span className="attendance-dot present"/>Present</div>
        <div><span className="attendance-dot absent"/>Absent</div>
        <div><span className="attendance-dot" style={{ background:"#9ca3af" }} />No Record</div>
    </div>
    </div>
    </div>
  );
}

export default MyAttendance;