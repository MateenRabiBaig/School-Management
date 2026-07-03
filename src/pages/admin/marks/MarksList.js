import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { Classes, Subjects } from "../../../data/data";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";

function MarksList() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState([]);

    const navigate = useNavigate();

    async function getData() {
        const studentsData = await getDocs(collection(db, "students"));
        const marksData = await getDocs(collection(db, "marks"));
        const tempStudents = [];
        const tempMarks = [];

        studentsData.forEach(doc => {tempStudents.push({firebaseId: doc.id,...doc.data()});});

        marksData.forEach(doc => {tempMarks.push(doc.data());});

        setStudents(tempStudents);
        setMarks(tempMarks);
    }

    useEffect(() => {
        getData();
    }, []);

    function getSubjectName(id) {
        const subject = Subjects.find(item => item.id === id);

        return subject?.name;
    }

    const uniqueRows = [];

    marks.forEach(mark => {
        const exists = uniqueRows.find(item => item.studentId === mark.studentId && item.subjectId === mark.subjectId);

        if (!exists) {
            uniqueRows.push(mark);
        }
    });

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Marks List" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                <h2>Marks List</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueRows.map((item,index)=>{
                                const student = students.find(stu => stu.firebaseId === item.studentId);

                                if(!student){
                                    return null;
                                }

                                const classData = Classes.find(cls => cls.id === student.classId);

                                return (
                                    <tr key={index}>
                                        <td>{student.name}</td>
                                        <td>{classData?.name}</td>
                                        <td>{getSubjectName(item.subjectId)}</td>
                                        <td>
                                            <button onClick={()=>navigate(`/admin/marks/details/${item.studentId}/${item.subjectId}`)}>View</button>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MarksList;