import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

function StudentAnnouncements() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

  const [announcements, setAnnouncements] = useState([]);

  async function loadData() {

    const result = await getDocs(collection(db,"announcements"));
    const temp = [];
    result.forEach(doc => { temp.push({ firebaseId: doc.id, ...doc.data()}); });
    setAnnouncements(temp);
  }

  useEffect(()=>{
    loadData();
  },[]);
  console.log(announcements)

  return (
    <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Announcements" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <h2>Announcements</h2>
        {announcements.map(
            item => (
              <div className="announcement-card" key={item.firebaseId}>
                <h3>{item.title}</h3>
                <p>{item.message}</p>
                <small>{item.type} {" | "} {item.createDate}</small>
              </div>
            )
          )
        }
      </div>
    </div>
  );
}

export default StudentAnnouncements;
