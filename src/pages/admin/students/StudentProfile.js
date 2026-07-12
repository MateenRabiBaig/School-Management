import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import Sidebar from "../../../components/Sidebar"
import Navbar from "../../../components/Navbar";
import { Classes, Subjects } from "../../../data/data";
import { getStudentById } from "../../../api/studentApi";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }
  return String(dateValue).slice(0, 10);
}

function MyProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navbarUser = getNavbarUser();
  const { id } = useParams();

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        
        if (!id) {
          return;
        }
        
        const response = await getStudentById(id);
        setStudent(response.student);
      }
      catch (error) {
        toast.error("Error loading profile: " + error.message);
      }
      finally {
        setLoading(false);
      }
    }
  loadProfile();
  }, [id]);

  function getClassName(classId) {
    return Classes.find((classItem) => classItem.id === Number(classId))?.name || "-";
  }

  function getSubjectName(subjectId) {
    return Subjects.find((subject) => subject.id === Number(subjectId))?.name || "-";
  }

  const photoUrl = student?.photo?.url || "";

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="My Profile" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>My Profile</h2>
            <p>View your student information</p>
          </div>
        </div>

        {loading ? (
          <div className="panel">Loading profile...</div>
        ) : !student ? (
          <div className="panel">Profile not found</div>
        ) : (
          <div className="profile-card">
            {photoUrl ? (
              <img className="profile-photo" src={photoUrl} alt={student.name} />
            ) : (
              <div className="profile-photo placeholder-photo">
                <UserRound size={38} />
              </div>
            )}
            <div className="profile-details">
              <div>
                <strong>Student ID:</strong> {student.studentId || "-"}
              </div>

              <div>
                <strong>Name:</strong> {student.name || "-"}
              </div>

              <div>
                <strong>Class:</strong> {getClassName(student.classId)}
              </div>

              <div>
                <strong>Subjects:</strong> {(student.subjectIds || []).map(getSubjectName).join(", ") || "-"}
              </div>

              <div>
                <strong>Gender:</strong> {student.gender || "-"}
              </div>

              <div>
                <strong>DOB:</strong> {formatDate(student.dob)}
              </div>

              <div>
                <strong>Mobile:</strong> {student.mobile || "-"}
              </div>

              <div>
                <strong>Parent Name:</strong> {student.parentName || "-"}
              </div>

              <div>
                <strong>Parent Contact:</strong> {student.parentContact || "-"}
              </div>

              <div>
                <strong>Admission Date:</strong> {formatDate(student.admissionDate)}
              </div>

              <div>
                <strong>Address:</strong> {student.address || "-"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProfile;