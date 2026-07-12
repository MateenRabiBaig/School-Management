import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Classes, Subjects } from "../../../data/data";
import { deleteTeacher, getTeachers } from "../../../api/teacherApi";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";

function TeacherList() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();
  const navbarUser = getNavbarUser();

  async function loadTeachers() {
    try {
      setLoading(true);
      const response = await getTeachers();
      setTeachers(response.teachers || []);
    }
    catch (error) {
      toast.error("Error loading teachers: " + error.message);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  function getClassName(classIds) {
    return (classIds || []).map((classId) => Classes.find((item) => item.id === Number(classId))?.name || "-").join(", ");
  }

  function getSubjectName(subjectIds) {
    return (subjectIds || []).map((subjectId) => Subjects.find((item) => item.id === Number(subjectId))?.name || "-").join(", ");
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await deleteTeacher(id);
      setTeachers((currentTeachers) => currentTeachers.filter((teacher) => teacher.id!=id))
      toast.success("Teacher deleted successfully")
    }
    catch (error) {
      toast.error("Error deleting teacher: " + error.message);
    }
  }

  const filteredTeacher = teachers.filter((teacher) => {
    const normalizedQuery = searchQuery.toLowerCase().trim()
    const matchSearch = searchBy === "id" ? String(teacher.teacherId || "").toLowerCase().includes(normalizedQuery) : String(teacher.name || "").toLowerCase().includes(normalizedQuery)
    const matchClass = selectedClass === "" || (teacher.assignedClasses || []).map(Number).includes((Number(selectedClass)))
    const matchSubject = selectedSubject === "" || (teacher.assignedSubjects || []).map(Number).includes(Number(selectedSubject))
    const matchStatus = statusFilter === "" || String(teacher.active) === statusFilter

    return (matchSearch && matchClass && matchSubject && matchStatus)
  })

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main">
        <Navbar
          title="Teachers"
          user={navbarUser}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="page-header">
          <div>
            <h2>Teachers</h2>
            <p>View and manage teacher profiles</p>
          </div>
          <button onClick={() => navigate("/admin/teachers/add")}>Add Teacher</button>
        </div>

        <div className="filter-container">
          <div className="search-group">
            <select value={searchBy} onChange={(event) => setSearchBy(event.target.value)}>
              <option value="name">Search by Name</option>
              <option value="id">Search by ID</option>
            </select>

            <input
              type="text"
              placeholder={
                searchBy === "id"
                  ? "Enter Teacher ID"
                  : "Enter Teacher Name"
              }
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

          <select value={selectedSubject} onChange={(event) => setSelectedSubject(event.target.value)}>
            <option value="">All Subjects</option>
            {Subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
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
              Loading teachers...
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Classes</th>
                  <th>Subjects</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTeacher.length === 0 ? (
                  <tr>
                    <td colSpan="7">No teachers found</td>
                  </tr>
                ) : (
                  filteredTeacher.map(
                    (teacher) => (
                      <tr key={teacher.id}>
                        <td>{teacher.teacherId || "-"}</td>
                        <td>{teacher.name || "-"}</td>
                        <td>{teacher.mobile || "-"}</td>
                        <td>{getClassName(teacher.assignedClasses) || "-"}</td>
                        <td>{getSubjectName(teacher.assignedSubjects) || "-"}</td>
                        <td>{teacher.active === false ? "No" : "Yes"}</td>
                        <td>
                          <button onClick={() => navigate(`/admin/teachers/${teacher.id}`)}>View</button>
                          <button onClick={() => navigate(`/admin/teachers/${teacher.id}?mode=edit`)}>Edit</button>
                          <button onClick={() => handleDelete(teacher.id)}>Delete</button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherList;