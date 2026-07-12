import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Classes, Subjects } from "../../../data/data";
import { deleteMarks, getMarks } from "../../../api/marksApi";
import { getActiveAcademicYear } from "../../../api/academicYearApi";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";

function MarksList() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [marks, setMarks] = useState([]);
  const [examType, setExamType] = useState("");
  const [classId, setClassId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const navigate = useNavigate();
  const navbarUser = getNavbarUser();

  useEffect(() => {
    async function loadActiveYear() {
      const activeYear = await getActiveAcademicYear();
      if (activeYear?.name) {
        setAcademicYear(activeYear.name);
      }
    }

    loadActiveYear();
  }, []);

  useEffect(() => {
    async function loadMarks() {
      try {
        const response = await getMarks({
          examType,
          classId,
          academicYear,
        });

        setMarks(response.marks || []);
      } catch (error) {
        toast.error("Error loading marks: " + error.message);
      }
    }

    loadMarks();
  }, [examType, classId, academicYear]);

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-";
  }

  function getClassName(id) {
    return Classes.find((item) => item.id === Number(id))?.name || "-";
  }

  const filteredMarks = marks.filter((record) => {
    const search = studentSearch.toLowerCase().trim();
    const studentName = record.student?.name || "";
    const studentId = record.student?.studentId || "";

    return (
      studentName.toLowerCase().includes(search) ||
      studentId.toLowerCase().includes(search)
    );
  });

  async function handleDelete(id) {
    if (!window.confirm("Delete this marks record?")) {
      return;
    }

    try {
      await deleteMarks(id);
      toast.success("Marks deleted successfully");
      setMarks((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      toast.error("Error deleting marks: " + error.message);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="Marks List" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Marks List</h2>
            <p>Browse saved marks records</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-bottom">
            <select value={examType} onChange={(event) => setExamType(event.target.value)}>
              <option value="">All Exams</option>
              <option value="Test 1">Test 1</option>
              <option value="Test 2">Test 2</option>
              <option value="Test 3">Test 3</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
            </select>

            <select value={classId} onChange={(event) => setClassId(event.target.value)}>
              <option value="">All Classes</option>
              {Classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Academic Year"
              value={academicYear}
              onChange={(event) => setAcademicYear(event.target.value)}
            />

            <input
              type="text"
              placeholder="Search student"
              value={studentSearch}
              onChange={(event) => setStudentSearch(event.target.value)}
            />
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Exam</th>
                  <th>Subjects</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMarks.map((record) => (
                  <tr key={record.id}>
                    <td>{record.student?.studentId || "-"}</td>
                    <td>{record.student?.name || "-"}</td>
                    <td>{getClassName(record.student?.classId)}</td>
                    <td>{record.examType}</td>
                    <td>
                      {(record.subjects || [])
                        .map(
                          (subject) =>
                            `${getSubjectName(subject.subjectId)} - ${subject.marks}/${subject.maxMarks}`
                        )
                        .join(", ")}
                    </td>
                    <td>
                      <button onClick={() => navigate(`/admin/marks?id=${record.id}`)}>
                        Edit
                      </button>

                      <button onClick={() => handleDelete(record.id)}>
                        Delete
                      </button>
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

export default MarksList;
