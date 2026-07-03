import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Classes, Subjects } from "../../data/data";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

function MyReportCard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const studentId = localStorage.getItem("studentId");
    const [student, setStudent] = useState(null);
    const [marks, setMarks] = useState([]);

    async function getData() {
        const studentSnapshot = await getDocs(collection(db,"students"));
        studentSnapshot.forEach(doc => {
            if(doc.id === studentId) {
                setStudent({
                    firebaseId: doc.id,
                    ...doc.data()
                });
            }
        });

        const marksSnapshot = await getDocs(collection(db,"marks"));
        const temp = [];
        marksSnapshot.forEach(doc => {
            const data = doc.data();
            if(data.studentId === studentId) {
                temp.push(data);
            }
        });
        setMarks(temp);
    }

    useEffect(()=> {
        getData();
    },[]);

    function getGrade(percentage) {
        if(percentage >= 90) return "A+";
        if(percentage >= 80) return "A";
        if(percentage >= 70) return "B";
        if(percentage >= 60) return "C";
        if(percentage >= 50) return "D";

        return "F";
    }

    const weights = {
        "Test 1" : 10,
        "Test 2" : 10,
        "Test 3" : 10,
        "Midterm" : 30,
        "Final Exam" : 40
    };

    const groupedMarks = {};

    marks.forEach(item => {
        if(!groupedMarks[item.subjectId]){
            groupedMarks[item.subjectId] = [];
        }
        groupedMarks[item.subjectId].push(item);
    });

    let overallPercentage = 0;
    let subjectCount = 0;

    Object.keys(groupedMarks).forEach(subjectId => {
        let percentage = 0;

        groupedMarks[subjectId].forEach(item => {
            percentage +=(Number(item.marks) * weights[item.examType]) / 100;
        });

        overallPercentage += percentage;
        subjectCount++;
    });

    overallPercentage = subjectCount ? overallPercentage / subjectCount : 0;

    if(!student){
        return <h2>Loading Details</h2>;
    }

    const classData =
        Classes.find(item => item.id === student.classId);

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main report-card-main">
                <Navbar title="Report Card" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                <div className="report-card-header">
                    <h2 className="report-card-title">Report Card</h2>
                    <button
                        onClick={()=>window.print()}
                        className="report-card-print"
                    >
                        Print / Export
                    </button>
                </div>
                <div className="summary-box">
                    <h3>Student Information</h3>
                    <p>Name : {" "} {student.name}</p>
                    <p>Class : {" "} {classData?.name}</p>
                    <p>Parent : {" "} {student.parentName}</p>
                    <p>Admission Date : {" "} {student.admissionDate}</p>
                </div>
                {Object.keys(groupedMarks).map(
                        subjectId => {
                            const subjectMarks = groupedMarks[subjectId];

                            let percentage = 0;
                            subjectMarks.forEach(
                                item => { percentage +=(Number(item.marks) * weights[item.examType]) /100; }
                            );

                            return (
                                <div className="result-card" key={subjectId}>
                                    <h3>{Subjects.find(s => s.id === Number(subjectId))?.name}</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Exam</th>
                                                <th>Marks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subjectMarks.map((item,index) => (
                                                        <tr key={index}>
                                                            <td>{item.examType}</td>
                                                            <td>{item.marks}</td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    <p>Percentage : {" "} {percentage.toFixed(2)}%</p>
                                    <p>Grade : {" "} {getGrade(percentage)}</p>
                                </div>
                            );
                        }
                    )
                }
                <div className="summary-box">
                    <h3>Overall Percentage : {" "} {overallPercentage.toFixed(2)}%</h3>
                    <h3>Overall Grade : {" "} {getGrade(overallPercentage)}</h3>
                </div>
            </div>
        </div>
    );
}

export default MyReportCard;
