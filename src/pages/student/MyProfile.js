import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { UserRound } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase/firebase";
import Navbar from "../../components/Navbar";

function MyProfile() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) return;
      const snapshot = await getDoc(doc(db, "students", studentId));
      if (snapshot.exists()) {
        setStudent({ firebaseId: snapshot.id, ...snapshot.data() });
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="My Profile" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>My Profile</h2>
            <p>Personal Details</p>
          </div>
        </div>

        {!student ? (
          <div className="panel">Loading profile</div>
        ) : (
          <div className="profile-card">
            {student.photo ? (
              <img className="profile-photo" src={student.photo} alt={student.name} />
            ) : (
              <div className="profile-photo placeholder-photo">
                <UserRound size={38} />
              </div>
            )}
            <div className="profile-details">
              <div><strong>Name:</strong> {student.name || "-"}</div>
              <div><strong>Gender:</strong> {student.gender || "-"}</div>
              <div><strong>DOB:</strong> {student.dob || "-"}</div>
              <div><strong>Mobile:</strong> {student.mobile || "-"}</div>
              <div><strong>Parent Name:</strong> {student.parentName || "-"}</div>
              <div><strong>Parent Contact:</strong> {student.parentContact || "-"}</div>
              <div><strong>Admission Date:</strong> {student.admissionDate || "-"}</div>
              <div><strong>Address:</strong> {student.address || "-"}</div>
              <div><strong>Active:</strong> {student.active === false ? "No" : "Yes"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
