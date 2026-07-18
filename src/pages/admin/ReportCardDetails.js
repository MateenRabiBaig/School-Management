import { Classes, Subjects } from "../../data/data";
import Sidebar from "../../components/Sidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import { getStudentById } from "../../api/studentApi";
import { getStudentResults } from "../../api/resultApi";
import { calculateResult } from "../../utils/resultUtils";
import getNavbarUser from "../../utils/getNavbarUser";
import ReportCardPDF from "../../components/reportCard/ReportCardPDF";

function ReportCardDetails() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navbarUser = getNavbarUser();

    async function loadReportCard() {
        try {
            setLoading(true);
            const studentResponse = await getStudentById(studentId);
            setStudent(studentResponse.student);
            const resultResponse = await getStudentResults(studentId);
            setResults(resultResponse.results || []);
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(()=> {
        loadReportCard();
    },[studentId]);

    if (loading) {
        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main">
                    <Navbar
                        title="Report Card Details"
                        user={navbarUser}
                        onToggleSidebar={() =>
                            setSidebarOpen(prev => !prev)
                        }
                    />
                    <div className="panel">Loading Report Card...</div>
                </div>
            </div>
        );
    }

    const classData = Classes.find(item => item.id === student.classId);

    // Calculate overall percentage across all exams
    const overallPercentage = results.length > 0
        ? results.reduce((acc, result) => {
            const summary = calculateResult(result.subjects);
            return acc + summary.percentage;
        }, 0) / results.length
        : 0;

    // Function to get grade based on percentage
    function getGrade(percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        return "F";
    }

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Report Card Details" user={navbarUser} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

                <h2>Report Card</h2>
                <div className="summary-box">
                    <h3>Student Information</h3>
                    <p>Name : {" "} {student.name}</p>
                    <p>Class : {" "} {classData?.name}</p>
                    <p>Parent : {" "} {student.parentName}</p>
                    <p>Admission Date : {" "} {student.admissionDate}</p>
                </div>
                {results.map(result => {
                    const summary = calculateResult(result.subjects);

                    return (
                        <div key={result.id} className="result-card">
                            <h3>{result.examType}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Marks</th>
                                        <th>Maximum</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.subjects.map(subject => (
                                        <tr key={subject.subjectId}>
                                            <td>{Subjects.find(s => s.id === subject.subjectId)?.name}</td>
                                            <td>{subject.marks}</td>
                                            <td>{subject.maxMarks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="summary-box">
                                <p>Total : {" "} {summary.obtained}/{summary.total}</p>
                                <p>Percentage : {" "} {summary.percentage}%</p>
                                <p>Grade : {" "} {summary.grade}</p>
                                <p>Status : {" "} {summary.status}</p>
                            </div>
                        </div>
                    );
                })}
                <div className="summary-box">
                    <h3>Overall Percentage : {" "} {overallPercentage.toFixed(2)}%</h3>
                    <h3>Overall Grade : {" "} {getGrade(overallPercentage)}</h3>
                </div>
            </div>
        </div>
    );
}

export default ReportCardDetails;