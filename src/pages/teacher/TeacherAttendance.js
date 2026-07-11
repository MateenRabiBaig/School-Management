import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Classes } from "../../data/data";
import { getMyTeacherProfile } from "../../api/teacherApi";
import { getStudents } from "../../api/studentApi";
import { markAttendance } from "../../api/attendanceApi";
import { toast } from "react-toastify";
import getNavbarUser from "../../utils/getNavbarUser";

function TeacherAttendance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navbarUser = getNavbarUser();

  useEffect(() => {
    async function loadTeacherAndStudents() {
      try {
        setLoading(true);

        const teacherResponse = await getMyTeacherProfile();
        const currentTeacher = teacherResponse.teacher || null;
        setTeacher(currentTeacher);

        const classId = currentTeacher?.assignedClasses?.[0] || "";
        setSelectedClass(classId ? String(classId) : "");

        if (classId) {
          const response = await getStudents({
            classId,
          });

          setStudents(response.students || []);
        } else {
          setStudents([]);
        }
      }
      catch (error) {
        toast.error("Error loading attendance data: " + error.message);
      }
      finally {
        setLoading(false);
      }
    }

    loadTeacherAndStudents();
  }, []);

  useEffect(() => {
    async function loadStudents() {
      if (!selectedClass) {
        setStudents([]);
        setAttendance({});
        return;
      }

      try {
        const response = await getStudents({
          classId: selectedClass,
        });

        setStudents(response.students || []);
        setAttendance({});
      } catch (error) {
        toast.error("Error loading students: " + error.message);
      }
    }

    if (teacher) {
      loadStudents();
    }
  }, [selectedClass, teacher]);

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

  function getClassName(id) {
    return Classes.find((item) => item.id === Number(id))?.name || "-";
  }

  if (loading) {
    return (
      <div className="wrapper">
        <Sidebar isOpen={sidebarOpen} />
        <div className="main">
          <Navbar title="Mark Attendance" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
          <div className="panel">Loading details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main">
        <Navbar title="Mark Attendance" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Mark Attendance</h2>
            <p>Attendance for {selectedDate}</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-bottom">
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />

            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
              <option value="">Select Class</option>
              {(teacher?.assignedClasses || []).map((classId) => (
                <option key={classId} value={classId}>
                  {getClassName(classId)}
                </option>
              ))}
            </select>
          </div>

          {students.length === 0 ? (
            <div className="panel">No students found</div>
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

export default TeacherAttendance;