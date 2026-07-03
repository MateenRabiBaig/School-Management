import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { Subjects } from "../../../data/data";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";

function MarksDetails() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const {studentId,subjectId} = useParams();

    const [student,setStudent] = useState(null);

    const [marks,setMarks] = useState([]);

    const getData = useCallback(async () => {
        const studentsData = await getDocs(collection(db,"students"));

        studentsData.forEach(doc => {
            if(doc.id === studentId){
                setStudent(doc.data());
            }
        });

        const marksData = await getDocs(collection(db,"marks"));

        const temp = [];

        marksData.forEach(doc => { const data = doc.data();

            if(data.studentId === studentId && String(data.subjectId) === subjectId) {
                temp.push(data);
            }
        });
        setMarks(temp);
    }, [studentId, subjectId]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{
        getData();
    },[getData]);

    function getGrade(percentage){
        if(percentage >= 90) return "A+";
        if(percentage >= 80) return "A";
        if(percentage >= 70) return "B";
        if(percentage >= 60) return "C";
        if(percentage >= 50) return "D";
        return "F";
    }

    const weights = {
        "Test 1":10,
        "Test 2":10,
        "Test 3":10,
        "Midterm":30,
        "Final Exam":40
    };

    let percentage = 0;

    marks.forEach(item=>{
        percentage += (Number(item.marks) * weights[item.examType]) / 100;
    });

    const subject = Subjects.find(item => item.id === Number(subjectId));

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Marks Details" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                <h2>Marks Details</h2>
                <h3>Student : {" "} {student?.name}</h3>
                <h3>Subject : {" "} {subject?.name}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Exam</th>
                            <th>Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marks.map((item,index)=>(
                                <tr key={index}>
                                    <td>{item.examType}</td>
                                    <td>{item.marks}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>

                <div className="summary-box">
                    <h3>Percentage : {" "} { percentage.toFixed(2) }%</h3>
                    <h3>Grade : {" "} { getGrade(percentage)}</h3>
                </div>
            </div>
        </div>
    );
}

export default MarksDetails;
