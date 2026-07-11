import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Classes } from "../../../data/data";
import { getAttendance, updateAttendance, deleteAttendance } from "../../../api/attendanceApi";
import { toast } from "react-toastify";
import getNavbarUser from "../../../utils/getNavbarUser";

function AttendanceRecords() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");

  const navbarUser = getNavbarUser();

  useEffect(() => {
    async function loadAttendance() {
      try {
        const response = await getAttendance({
          date: selectedDate,
          classId: selectedClass,
        });

        setAttendance(response.attendance || []);
      }
      catch (error) {
        toast.error("Error loading attendance: " + error.message);
      }
    }

    loadAttendance();
  }, [selectedDate, selectedClass]);

  function startEdit(record) {
    setEditingId(record.id);
    setEditStatus(record.status);
    setEditRemarks(record.remarks || "");
  }

  async function handleSaveEdit(id) {
    try {
      await updateAttendance(id, {
        status: editStatus,
        remarks: editRemarks,
      });

      toast.success("Attendance updated successfully");
      setEditingId(null);

      const response = await getAttendance({
        date: selectedDate,
        classId: selectedClass,
      });

      setAttendance(response.attendance || []);
    }
    catch (error) {
      toast.error("Error updating attendance: " + error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this attendance record?")) {
      return;
    }

    try {
      await deleteAttendance(id);
      toast.success("Attendance deleted successfully");

      setAttendance((current) => current.filter((item) => item.id !== id));
    }
    catch (error) {
      toast.error("Error deleting attendance: " + error.message);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main">
        <Navbar title="Attendance Records" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Attendance Records</h2>
            <p>All stored attendance entries</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-bottom">
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />

            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
              <option value="">All Classes</option>
              {Classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.student?.studentId || "-"}</td>
                    <td>{record.student?.name || "-"}</td>
                    <td>{record.student?.classId || "-"}</td>
                    <td>{record.attendanceDate ? String(record.attendanceDate).slice(0, 10) : "-"}</td>
                    <td>
                      {editingId === record.id ? (
                        <select value={editStatus} onChange={(event) => setEditStatus(event.target.value)}>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      ) : (
                        record.status
                      )}
                    </td>
                    <td>
                      {editingId === record.id ? (
                        <input value={editRemarks} onChange={(event) => setEditRemarks(event.target.value)} />
                      ) : (
                        record.remarks || "-"
                      )}
                    </td>
                    <td>
                      {editingId === record.id ? (
                        <button onClick={() => handleSaveEdit(record.id)}>Save</button>
                      ) : (
                        <button onClick={() => startEdit(record)}>Edit</button>
                      )}

                      <button onClick={() => handleDelete(record.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceRecords;