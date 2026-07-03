import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { UserRound } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase/firebase";
import { Classes, Subjects } from "../../data/data";
import Navbar from "../../components/Navbar";

function TeacherProfile() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const teacherId = localStorage.getItem("teacherId");
      if (!teacherId) return;

      const snapshot = await getDoc(doc(db, "teachers", teacherId));
      if (snapshot.exists()) {
        setTeacher({ firebaseId: snapshot.id, ...snapshot.data() });
      }
    }

    loadProfile();
  }, []);

  const classNames = useMemo(() => {
    if (!teacher?.classIds) return "-";
    return teacher.classIds
      .map((classId) => Classes.find((item) => item.id === Number(classId))?.name || "-")
      .join(", ");
  }, [teacher]);

  const subjectNames = useMemo(() => {
    if (!teacher?.subjectIds) return "-";
    return teacher.subjectIds
      .map((subjectId) => Subjects.find((item) => item.id === Number(subjectId))?.name || "-")
      .join(", ");
  }, [teacher]);

  return (
    <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="My Profile" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>My Profile</h2>
            <p>Teacher details and assigned work</p>
          </div>
        </div>

        {!teacher ? (
          <div className="panel">Loading profile</div>
        ) : (
          <div className="profile-card">
            {teacher.photo ? (
              <img className="profile-photo" src={teacher.photo} alt={teacher.name} />
            ) : (
              <div className="profile-photo placeholder-photo">
                <UserRound size={38} />
              </div>
            )}
            <div className="profile-details">
              <div><strong>Name:</strong> {teacher.name || "-"}</div>
              <div><strong>Teacher ID:</strong> {teacher.id || "-"}</div>
              <div><strong>Password:</strong> {teacher.password || "-"}</div>
              <div><strong>Classes:</strong> {classNames}</div>
              <div><strong>Subjects:</strong> {subjectNames}</div>
              <div><strong>Active:</strong> {teacher.active === false ? "No" : "Yes"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherProfile;