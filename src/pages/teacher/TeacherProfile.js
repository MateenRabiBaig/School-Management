import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Classes, Subjects } from "../../data/data";
import { getMyTeacherProfile } from "../../api/teacherApi";
import getNavbarUser from "../../utils/getNavbarUser";
import { toast } from "react-toastify";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return String(value).slice(0, 10);
}

function TeacherProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const navbarUser = getNavbarUser();

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);

        const response = await getMyTeacherProfile();
        setTeacher(response.teacher);
      } catch (error) {
        toast.error("Error loading profile: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function getClassName(classId) {
    return Classes.find((classItem) => classItem.id === Number(classId))?.name || "-";
  }

  function getSubjectName(subjectId) {
    return Subjects.find((subject) => subject.id === Number(subjectId))?.name || "-";
  }

  const photoUrl = teacher?.photo?.url || "";

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="My Profile" user={navbarUser} onToggleSidebar={() => setSidebarOpen((previous) => !previous)} />

        <div className="page-header">
          <div>
            <h2>My Profile</h2>
            <p>View your teacher information</p>
          </div>
        </div>

        {loading ? (
          <div className="panel">Loading profile...</div>
        ) : !teacher ? (
          <div className="panel">Profile not found</div>
        ) : (
          <div className="profile-card">
            {photoUrl ? (
              <img className="profile-photo" src={photoUrl} alt={teacher.name} />
            ) : (
              <div className="profile-photo placeholder-photo">
                <UserRound size={38} />
              </div>
            )}

            <div className="profile-details">
              <div>
                <strong>Teacher ID:</strong> {teacher.teacherId || "-"}
              </div>

              <div>
                <strong>Name:</strong> {teacher.name || "-"}
              </div>

              <div>
                <strong>Gender:</strong> {teacher.gender || "-"}
              </div>

              <div>
                <strong>DOB:</strong> {formatDate(teacher.dob)}
              </div>

              <div>
                <strong>Mobile:</strong> {teacher.mobile || "-"}
              </div>

              <div>
                <strong>Email:</strong> {teacher.email || "-"}
              </div>

              <div>
                <strong>Classes:</strong> {(teacher.assignedClasses || []).map(getClassName).join(", ") || "-"}
              </div>

              <div>
                <strong>Subjects:</strong> {(teacher.assignedSubjects || []).map(getSubjectName).join(", ") || "-"}
              </div>

              <div>
                <strong>Joining Date:</strong> {formatDate(teacher.joiningDate)}
              </div>

              <div>
                <strong>Status:</strong> {teacher.active ? "Active" : "Inactive"}
              </div>

              <div>
                <strong>Address:</strong> {teacher.address || "-"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherProfile;
