import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Classes } from "../../data/data";
import Navbar from "../../components/Navbar";

function TeacherStudents() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [students, setStudents] = useState([]);

    async function loadStudents() {
        const teacherId = localStorage.getItem("teacherId");
        let teacher = null;

        const teacherResult = await getDocs(collection(db,"teachers"));
        teacherResult.forEach(doc => {
            if(doc.id === teacherId) {
                teacher = {
                    firebaseId: doc.id,
                    ...doc.data()
                };
            }
        });

        const studentsResult = await getDocs(collection(db,"students"));
        const temp = [];

        studentsResult.forEach(doc => {
            const student = {
                firebaseId: doc.id,
                ...doc.data()
            };

            if(teacher?.classIds.includes(student.classId)) {
                temp.push(student);
            }
        });
        setStudents(temp);
    }

    useEffect(()=>{
        loadStudents();
    },[]);


    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Students" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                <h2>Students</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Class</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => {
                            const classData = Classes.find(item => item.id === student.classId);
                            return (
                                <tr key={student.firebaseId}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{classData.name}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TeacherStudents;