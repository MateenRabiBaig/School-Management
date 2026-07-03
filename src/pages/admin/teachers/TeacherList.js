import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { db } from "../../../firebase/firebase";
import { Classes, Subjects } from "../../../data/data";
import { toast } from "react-toastify";

function TeacherList() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  async function loadTeachers() {
    try {
      const snapshot = await getDocs(collection(db, "teachers"));
      const rows = [];
      snapshot.forEach((item) => rows.push({ firebaseId: item.id, ...item.data() }));
      setTeachers(rows);
    } catch (error) {
      toast.error("Error loading teachers: " + error.message);
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  function getClassNames(classIds) {
    return (classIds || []).map((classId) => Classes.find((item) => item.id === Number(classId))?.name || "-").join(", ");
  }

  function getSubjectNames(subjectIds) {
    return (subjectIds || []).map((subjectId) => Subjects.find((item) => item.id === Number(subjectId))?.name || "-").join(", ");
  }

  async function handleDelete(teacherId) {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await deleteDoc(doc(db, "teachers", teacherId));
      toast.success("Teacher deleted successfully!");
      loadTeachers();
    } catch (error) {
      toast.error("Error deleting teacher: " + error.message);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main">
        <Navbar
          title="Teachers"
          user={{
            name: localStorage.getItem("user") || "User",
            role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1),
          }}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="page-header">
          <div>
            <h2>Teachers</h2>
            <p>View and manage teacher profiles</p>
          </div>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Classes</th>
                <th>Subjects</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.firebaseId}>
                  <td>{teacher.name || "-"}</td>
                  <td>{getClassNames(teacher.classIds) || "-"}</td>
                  <td>{getSubjectNames(teacher.subjectIds) || "-"}</td>
                  <td>{teacher.active === false ? "No" : "Yes"}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/teachers/${teacher.firebaseId}`)}>View</button>
                    <button onClick={() => navigate(`/admin/teachers/${teacher.firebaseId}?mode=edit`)}>Edit</button>
                    <button onClick={() => handleDelete(teacher.firebaseId)}>Delete</button>
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

export default TeacherList;
