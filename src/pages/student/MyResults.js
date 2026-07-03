import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Subjects } from "../../data/data";
import Navbar from "../../components/Navbar";

function MyResults() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [marks, setMarks] = useState([]);

    async function getMarks() {
        const studentId = localStorage.getItem("studentId");
        const result = await getDocs(collection(db, "marks"));
        const temp = [];

        result.forEach(doc => {
                const data =
                doc.data();

            if (data.studentId === studentId) {
                temp.push(data);
            }
        });
        setMarks(temp);
    }

    useEffect(() => {
        getMarks();
    }, []);

    function getSubjectName(id) {
        const subject = Subjects.find(item => item.id === Number(id));
        return subject?.name;
    }

    function getGrade(percentage) {
        if (percentage >= 90)
            return "A+";
        if (percentage >= 80)
            return "A";
        if (percentage >= 70)
            return "B";
        if (percentage >= 60)
            return "C";
        if (percentage >= 50)
            return "D";
        return "F";
    }

    const groupedMarks = {};

    marks.forEach(item => {
        if (!groupedMarks[item.subjectId]) {
            groupedMarks[item.subjectId] = [];
        }

        groupedMarks[item.subjectId].push(item);
    });

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="My Results" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                <h2>My Results</h2>
                {Object.keys(groupedMarks).map(
                        subjectId => {
                            const subjectMarks = groupedMarks[subjectId];
                            const weights = {
                                "Test 1":10,
                                "Test 2":10,
                                "Test 3":10,
                                "Midterm":30,
                                "Final Exam":40
                            };

                            let percentage = 0;

                            subjectMarks.forEach(item => {
                                    percentage +=(Number(item.marks) * weights[item.examType]) / 100;
                                }
                            );

                            return (
                                <div className="result-card" key={subjectId}>
                                    <h3>{getSubjectName(subjectId)}</h3>
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
                                    <div className="summary-box">
                                        <p>Percentage : {" "} {percentage.toFixed(2)}%</p>
                                        <p>Grade : {" "} {getGrade(percentage)}</p>
                                    </div>
                                </div>
                            );
                        }
                    )
                }
            </div>
        </div>
    );
}

export default MyResults;