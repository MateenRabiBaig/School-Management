import Sidebar from "../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

function MyAttendance() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [attendance, setAttendance] = useState([]);

    async function getAttendance() {
        const studentId = localStorage.getItem("studentId");
        const result = await getDocs(collection(db,"attendance"));
        const temp = [];

        result.forEach(doc=>{
            const data = doc.data();
            if(data.studentId === studentId) {
                temp.push(data);
            }
        })
        setAttendance(temp);
    }

    useEffect(()=>{
        getAttendance();
    },[]);

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="My Attendance" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                <div className="page-header">
                    <div>
                        <h2>My Attendance</h2>
                        <p>Your attendance history</p>
                    </div>
                </div>
                <div className="table-card">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((item,index)=>(
                                <tr key={index}>
                                    <td>{item.date}</td>
                                    <td>{item.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default MyAttendance;
