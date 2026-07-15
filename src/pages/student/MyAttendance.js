import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getStudentAttendance } from "../../api/attendanceApi";
import { toast } from "react-toastify";
import getNavbarUser from "../../utils/getNavbarUser";
import { useMemo } from "react";

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

<div className="panel">

    <label>

        Filter by Month

    </label>

    <select

        value={selectedMonth}

        onChange={e =>
            setSelectedMonth(
                e.target.value
            )
        }

    >

        {months.map(month => (

            <option
                key={month}
                value={month}
            >

                {month}

            </option>

        ))}

    </select>

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
    </div>
      </div>
    </div>
  );
}

export default MyAttendance;