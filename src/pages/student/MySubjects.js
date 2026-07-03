import Sidebar from "../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { Classes, Subjects } from "../../data/data";
import Navbar from "../../components/Navbar";

function MySubjects() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [ student, setStudent ] = useState(null);

    async function getStudent() {
        const studentId = localStorage.getItem("studentId");
        const result = await getDocs(collection(db,"students"));
        result.forEach(doc=>{
            if(doc.id === studentId) {
                setStudent(doc.data());
            }
        });
    }

    useEffect(()=>{
        getStudent();
    },[]);

    function getSubjectName(id) {
        const subject = Subjects.find(item=>item.id === id);
        return subject.name;
    }

    if(!student) {
        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main">
                    <Navbar title="My Subjects" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                    <div className="panel">Loading subjects</div>
                </div>
            </div>
        );
    }

    const classData = Classes.find(item=>item.id === student.classId);

    const final = [...classData.compulsorySubjects,...student.selectedSubjects];


    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="My Subjects" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                <div className="page-header">
                    <div>
                        <h2>My Subjects</h2>
                        <p>Subjects assigned to your class</p>
                    </div>
                </div>
                <div className="panel">
                    {final.map(id=>(
                        <div key={id} className="list-item">{getSubjectName(id)}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MySubjects;
