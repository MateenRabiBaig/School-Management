import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { db } from "../../../firebase/firebase";
import { Classes, Subjects } from "../../../data/data";
import Navbar from "../../../components/Navbar";
import { toast } from "react-toastify";

function StudentList() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [selectedClass, setSelectedClass] = useState("");
  const [statusFilter,setStatusFilter] = useState("");

  async function loadStudents() {
    try {
      const snapshot = await getDocs(collection(db, "students"));
      const rows = [];
      snapshot.forEach((item) => rows.push({ firebaseId: item.id, ...item.data() }));
      setStudents(rows);
    } catch (error) {
      toast.error("Error loading students: " + error.message);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function getClassName(classId) {
    return Classes.find((item) => item.id === Number(classId))?.name || "-";
  }

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-";
  }

  function getStudentSubjects(student) {
    const classData = Classes.find((item) => item.id === Number(student.classId));
    const compulsory = classData ? classData.compulsorySubjects : [];
    const optional = Array.isArray(student.selectedSubjects) ? student.selectedSubjects : [];
    return [...new Set([...compulsory, ...optional])].map(getSubjectName).filter(Boolean);
  }

  async function handleDelete(studentId) {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteDoc(doc(db, "students", studentId));
      toast.success("Student deleted successfully!");
      loadStudents();
    } catch (error) {
      toast.error("Error deleting student: " + error.message);
    }
  }

  const filteredStudents = students.filter(student => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchSearch =
      searchBy === "id"
        ? String(student.id || "").includes(searchQuery)
        : String(student.name || "").toLowerCase().includes(normalizedQuery);
    const matchClass = selectedClass === "" || Number(selectedClass) === student.classId;
    const matchStatus = statusFilter === "" || String(student.active) === statusFilter;

    return (matchSearch && matchClass && matchStatus);
  });

  return (
    <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Students" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Students</h2>
            <p>View, edit, and manage student profiles</p>
          </div>
          <button onClick={() => navigate("/admin/students/add")}>Add Student</button>
        </div>

        <div className="filter-container">
          <div className="search-group">
            <select value={searchBy} onChange={(e)=>setSearchBy(e.target.value)}>
              <option value="name">Search by Name</option>
              <option value="id">Search by ID</option>
            </select>

            <input
              type="text"
              placeholder={searchBy === "id" ? "Enter Student ID" : "Enter Student Name"}
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e)=>setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {Classes.map(cls=> (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e)=>setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Mobile</th>
                <th>Active</th>
                <th>Subjects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.firebaseId}>
                  <td>{student.name || "-"}</td>
                  <td>{getClassName(student.classId)}</td>
                  <td>{student.mobile || "-"}</td>
                  <td>{student.active === false ? "No" : "Yes"}</td>
                  <td>{getStudentSubjects(student).join(", ") || "-"}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/students/${student.firebaseId}`)}>View</button>
                    <button onClick={() => navigate(`/admin/students/${student.firebaseId}?mode=edit`)}>Edit</button>
                    <button onClick={() => handleDelete(student.firebaseId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentList;
