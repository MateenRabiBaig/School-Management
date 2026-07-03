import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase/firebase";
import Navbar from "../../components/Navbar";

function TeacherAnnouncements() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  async function loadData() {
    const result = await getDocs(collection(db, "announcements"));
    const temp = [];

    result.forEach((doc) => {
      temp.push({
        firebaseId: doc.id,
        ...doc.data()
      });
    });

    temp.sort((a, b) => new Date(b.createDate || b.createdDate || 0) - new Date(a.createDate || a.createdDate || 0));
    setAnnouncements(temp);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Announcements" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Announcements</h2>
            <p>School updates and notices</p>
          </div>
        </div>

        {announcements.length === 0 ? (
          <div className="panel">No announcements available.</div>
        ) : (
          announcements.map((item) => (
            <div className="announcement-card" key={item.firebaseId}>
              <h3>{item.title || "-"}</h3>
              <p>{item.message || "-"}</p>
              <small>
                {item.type || "General"} {" | "} {item.createDate || item.createdDate || "-"}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherAnnouncements;
