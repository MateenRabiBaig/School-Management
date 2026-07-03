import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Classes, Subjects } from "../../data/data";
import Navbar from "../../components/Navbar";

function TeacherClasses() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [teacher, setTeacher] = useState(null);

    async function loadTeacher() {
        const teacherId = localStorage.getItem("teacherId");
        const result = await getDocs(collection(db,"teachers"));

        result.forEach(doc => {
            if(doc.id === teacherId) {
                setTeacher({
                    firebaseId: doc.id,
                    ...doc.data()
                });
            }
        });
    }

    useEffect(()=>{
        loadTeacher();
    },[]);

    if(!teacher) {
        return <h2>Loading Details</h2>
    }


    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="My Classes" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                <h2>My Classes</h2>
                {teacher.classIds.map(
                    classId => {
                        const classData = Classes.find(c => c.id === classId);

                        return (
                            <div key={classId} className="class-card">
                                <h3>{classData?.name}</h3>
                                <p>Subjects: {" "} {teacher.subjectIds.map(id => Subjects.find(s => s.id === id)?.name).join(", ")}</p>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    )
}

export default TeacherClasses;