import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import { getStudents } from "../../api/studentApi";
import { Classes } from "../../data/data";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import getNavbarUser from "../../utils/getNavbarUser";

function ReportCards() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const navbarUser = getNavbarUser();

    async function loadStudents() {
        try {
            const response = await getStudents();
            setStudents(response.students || []);
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        loadStudents();
    },[]);

    console.log(students)
    // console.log("studentId:", studentId);

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Report Cards" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

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
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{classData?.name}</td>
                                    <td>
                                        <button onClick={()=>navigate(`/admin/report-card/${student.id}`)}>View</button>
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