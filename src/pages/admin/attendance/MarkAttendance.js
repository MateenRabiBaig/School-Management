import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Classes } from "../../../data/data";
import { getStudents } from "../../../api/studentApi";
import { markAttendance } from "../../../api/attendanceApi";
import { toast } from "react-toastify";
import getNavbarUser from "../../../utils/getNavbarUser";

function MarkAttendance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navbarUser = getNavbarUser();

  useEffect(() => {
    async function loadStudents() {
      if (!selectedClass) {
        setStudents([]);
        setAttendance({});
        return;
      }

      try {
        setLoading(true);
        const response = await getStudents({
          classId: selectedClass,
        });

        setStudents(response.students || []);
        setAttendance({});
      }
      catch (error) {
        toast.error("Error loading students: " + error.message);
      }
      finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, [selectedClass]);

  function updateAttendance(studentId, status) {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  }

  async function handleSave() {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }

    if (students.length === 0) {
      toast.error("No students found");
      return;
    }

    try {
      setSaving(true);

      const records = students.map((student) => ({
        studentId: student.id,
        status: attendance[student.id] || "Absent",
      }));

      await markAttendance({
        attendanceDate: selectedDate,
        records,
      });

      toast.success("Attendance saved successfully!");
    }
    catch (error) {
      toast.error("Error marking attendance: " + error.message);
    }
    finally {
      setSaving(false);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main">
        <Navbar title="Mark Attendance" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Mark Attendance</h2>
            <p>Mark attendance for selected class</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-bottom">
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />

            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
              <option value="">Select Class</option>
              {Classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="panel">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="panel">Select a class to load students</div>
          ) : (
            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.studentId || "-"}</td>
                      <td>{student.name || "-"}</td>
                      <td>{attendance[student.id] || "Absent"}</td>
                      <td>
                        <button onClick={() => updateAttendance(student.id, "Present")}>
                          Present
                        </button>

                        <button onClick={() => updateAttendance(student.id, "Absent")}>
                          Absent
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button onClick={handleSave} disabled={saving || !selectedClass}>
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarkAttendance;