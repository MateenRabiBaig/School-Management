import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Classes } from "../../data/data";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function ReportCards() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();

    async function getStudents() {
        const result = await getDocs(collection(db,"students"));
        const temp = [];
        result.forEach(doc => {
            temp.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });
        setStudents(temp);
    }

    useEffect(()=>{
        getStudents();
    },[]);

    console.log(students)
    // console.log("studentId:", studentId);

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Report Cards" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                <h2>Report Cards</h2>

                <table>
                    <thead>
                        <th>Student</th>
                        <th>Class</th>
                        <th>Action</th>
                    </thead>

                    <tbody>
                        {students.map(student=>{
                            const classData = Classes.find(item => item.id === student.classId);
                            return (
                                <tr key={student.firebaseId}>
                                    <td>{student.name}</td>
                                    <td>{classData?.name}</td>
                                    <td>
                                        <button onClick={()=>navigate(`/admin/report-card/${student.firebaseId}`)}>View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReportCards;