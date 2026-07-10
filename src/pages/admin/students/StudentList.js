import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Classes, Subjects } from "../../../data/data";
import { deleteStudent, getStudents } from "../../../api/studentApi";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";

function StudentList() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchBy, setSearchBy] = useState("name")
  const [selectedClass, setSelectedClass] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const navigate = useNavigate()
  const navbarUser = getNavbarUser()

  async function loadStudents() {
    try {
      setLoading(true)
      const response = await getStudents()
      setStudents(response.students || [])
    } 
    catch (error) {
      toast.error("Error loading students: " + error.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  function getClassName(classId) {
    return Classes.find((item) => item.id === Number(classId))?.name || "-"
  }

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-"
  }

  function getStudentSubjects(student) {
    const subjectIds = student.subjectIds || []
    return subjectIds.map(getSubjectName).filter(Boolean)
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this student?")) {
      return
    }

    try {
      await deleteStudent(id)
      toast.success("Student deleted successfully!")
      setStudents((currentStudents) => currentStudents.filter((student) => student.id !== id))
    }
    catch (error) {
      toast.error("Error deleting student: " + error.message)
    }
  }

  const filteredStudents = students.filter((student) => {
    const normalizedQuery = searchQuery.toLowerCase().trim()

    const matchSearch = searchBy === "id" ? String(student.studentId || "").toLowerCase().includes(normalizedQuery) : String(student.name || "").toLowerCase().includes(normalizedQuery)
    const matchClass = selectedClass === "" || Number(selectedClass) === Number(student.classId)
    const matchStatus = statusFilter === "" || String(student.active) === statusFilter

    return (matchSearch && matchClass && matchStatus)
  })

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="Students" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Students</h2>
            <p>View, edit, and manage student profiles</p>
          </div>

          <button onClick={() => navigate("/admin/students/add")}>Add Student</button>
        </div>

        <div className="filter-container">
          <div className="search-group">
            <select value={searchBy} onChange={(event) => setSearchBy(event.target.value)}>
              <option value="name">Search by Name</option>
              <option value="id">Search by ID</option>
            </select>

            <input
              type="text"
              placeholder={ searchBy === "id" ? "Enter Student ID" : "Enter Student Name" }
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
            <option value="">All Classes</option>

            {Classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>{classItem.name}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="table-card">
          {loading ? (
            <div className="panel">
              Loading students...
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Mobile</th>
                  <th>Active</th>
                  <th>Subjects</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.studentId || "-"}</td>
                      <td>{student.name || "-"}</td>
                      <td>{getClassName(student.classId)}</td>
                      <td>{student.mobile || "-"}</td>
                      <td>{student.active === false ? "No" : "Yes"}</td>
                      <td>{getStudentSubjects(student).join(", ") || "-"}</td>
                      <td>
                        <button onClick={() => navigate(`/admin/students/${student.id}`)}>
                          View
                        </button>

                        <button onClick={() => navigate(`/admin/students/${student.id}?mode=edit`)}>
                          Edit
                        </button>

                        <button onClick={() => handleDelete(student.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentList;