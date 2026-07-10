import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  ClipboardCheck,
  NotebookPen,
  Megaphone,
  UserRound,
  BookOpen,
  ListChecks,
  UserPlus,
  GraduationCap,
  BookMarked,
  LogOut,
} from "lucide-react";

import { clearAuth, getStoredUser } from "../utils/authStorage";

function Sidebar({ isOpen = true }) {
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const role = storedUser?.role || localStorage.getItem("role");
  const [studentsOpen, setStudentsOpen] = useState(true);
  const [marksOpen, setMarksOpen] = useState(true);
  const [teachersOpen, setTeachersOpen] = useState(true);

  let roleName = "Teacher";
  if (role === "admin") {
    roleName = "Admin";
  } else if (role === "student") {
    roleName = "Student";
  }

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      <h3>{roleName}</h3>
      <div className="menu">
        {role === "admin" && (
          <>
            <div className="menu-item" onClick={() => navigate("/admin")}>
              <Home size={18} />
              {isOpen && <span>Home</span>}
            </div>

            <div className="menu-item menu-accordion" onClick={() => setTeachersOpen((prev) => !prev)}>
              <span className="menu-label">
                <Users size={18} />
                {isOpen && <span>Teachers</span>}
              </span>

              {isOpen &&
                (teachersOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </div>

            {teachersOpen && (
              <div className="accordion-body">
                <div className="menu-item menu-child" onClick={() => navigate("/admin/teachers")}>
                  <ListChecks size={18} />
                  {isOpen && <span>Teachers</span>}
                </div>

                <div className="menu-item menu-child" onClick={() => navigate("/admin/teachers/add")}>
                  <UserPlus size={18} />
                  {isOpen && <span>Add Teacher</span>}
                </div>
              </div>
            )}

            <div className="menu-item menu-accordion" onClick={() => setStudentsOpen((prev) => !prev)}>
              <span className="menu-label">
                <Users size={18} />
                {isOpen && <span>Students</span>}
              </span>

              {isOpen &&
                (studentsOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </div>

            {studentsOpen && (
              <div className="accordion-body">
                <div className="menu-item menu-child" onClick={() => navigate("/admin/students")}>
                  <ListChecks size={18} />
                  {isOpen && <span>Students</span>}
                </div>

                <div className="menu-item menu-child" onClick={() => navigate("/admin/students/add")}>
                  <UserPlus size={18} />
                  {isOpen && <span>Add Student</span>}
                </div>
              </div>
            )}

            <div className="menu-item" onClick={() => navigate("/admin/attendance")}>
              <ClipboardCheck size={18} />
              {isOpen && <span>Attendance</span>}
            </div>

            <div className="menu-item menu-accordion" onClick={() => setMarksOpen((prev) => !prev)}>
              <span className="menu-label">
                <NotebookPen size={18} />
                {isOpen && <span>Marks</span>}
              </span>

              {isOpen &&
                (marksOpen ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </div>

            {marksOpen && (
              <div className="accordion-body">
                <div className="menu-item menu-child" onClick={() => navigate("/admin/marks/list")}>
                  <BookMarked size={18} />
                  {isOpen && <span>Marks List</span>}
                </div>

                <div className="menu-item menu-child" onClick={() => navigate("/admin/marks")}>
                  <GraduationCap size={18} />
                  {isOpen && <span>Add Marks</span>}
                </div>
              </div>
            )}

            <div className="menu-item" onClick={() => navigate("/admin/report-cards")}>
              <BookMarked size={18} />
              {isOpen && <span>Report Cards</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/admin/announcements")}>
              <Megaphone size={18} />
              {isOpen && <span>Announcements</span>}
            </div>
          </>
        )}

        {role === "student" && (
          <>
            <div className="menu-item" onClick={() => navigate("/student")}>
              <Home size={18} />
              {isOpen && <span>Home</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/student/subjects")}>
              <BookOpen size={18} />
              {isOpen && <span>Subjects</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/student/attendance")}>
              <ClipboardCheck size={18} />
              {isOpen && <span>Attendance</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/student/results")}>
              <NotebookPen size={18} />
              {isOpen && <span>Results</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/student/report-card")}>
              <BookMarked size={18} />
              {isOpen && <span>Report Card</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/student/student-announcements")}>
              <Megaphone size={18} />
              {isOpen && <span>Announcements</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/student/profile")}>
              <UserRound size={18} />
              {isOpen && <span>Profile</span>}
            </div>
          </>
        )}

        {role === "teacher" && (
          <>
            <div className="menu-item" onClick={() => navigate("/teacher")}>
              <Home size={18} />
              {isOpen && <span>Home</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/teacher/classes")}>
              <BookOpen size={18} />
              {isOpen && <span>My Classes</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/teacher/students")}>
              <Users size={18} />
              {isOpen && <span>Students</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/teacher/attendance")}>
              <ClipboardCheck size={18} />
              {isOpen && <span>Attendance</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/teacher/marks")}>
              <NotebookPen size={18} />
              {isOpen && <span>Marks</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/teacher/announcements")}>
              <Megaphone size={18} />
              {isOpen && <span>Announcements</span>}
            </div>

            <div className="menu-item" onClick={() => navigate("/teacher/profile")}>
              <UserRound size={18} />
              {isOpen && <span>Profile</span>}
            </div>
          </>
        )}

        <div className="logout" onClick={logout}>
          <LogOut size={18} />
          {isOpen && <span>Log out</span>}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;