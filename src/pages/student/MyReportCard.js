import { toast } from "react-toastify";
import getNavbarUser from "../../utils/getNavbarUser";
import { getMyStudentProfile } from "../../api/studentApi";
import { getStudentResults } from "../../api/resultApi";
import { calculateResult } from "../../utils/resultUtils";
import { Classes, Subjects } from "../../data/data";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import ReportCardPDF from "../../components/reportCard/ReportCardPDF";

function MyReportCard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navbarUser = getNavbarUser();
    const [student, setStudent] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const reportData = { student, results, className: Classes.find(item => item.id === student.classId)?.name || "", schoolName: "ABC School", generatedOn: new Date() };

    async function loadReportCard() {

        try {
            setLoading(true);
            const profileResponse = await getMyStudentProfile();
            const currentStudent = profileResponse.student;
            setStudent(currentStudent);
            const resultResponse = await getStudentResults(currentStudent.id);
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
    },[]);

    if (loading) {

        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main">
                    <Navbar
                        title="Report Card"
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

    const classData =
        Classes.find(item => item.id === student.classId);

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main report-card-main">
                <Navbar title="Report Card" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                <div className="report-card-header">
                    <h2 className="report-card-title">Report Card</h2>
                    <ReportCardPDF report={reportData} />
                </div>
                <div className="summary-box">
                    <h3>Student Information</h3>
                    <p>Name : {" "} {student.name}</p>
                    <p>Class : {" "} {classData?.name}</p>
                    <p>Parent : {" "} {student.parentName}</p>
                    <p>Admission Date : {" "} {student.admissionDate}</p>
                </div>
                {results.length === 0 ? (
                    <div className="panel">No report card available</div>
                ) : (
                    results.map(result => {
                        const summary = calculateResult(result.subjects);
                        return (
                        <div className="result-card" key={result.id}>
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
                                <p>Total : {" "} {summary.obtained} / {summary.total}</p>
                                <p>Percentage : {" "} {summary.percentage}%</p>
                                <p>Grade : {" "} {summary.grade}</p>
                                <p>Status : {" "} {summary.status}</p>
                            </div>
                        </div>
                    );
                }))}
                <div className="summary-box">
                    <h3>Student Information</h3>
                    <p>Name : {" "} {student.name}</p>
                    <p>Class : {" "} {Classes.find(item => item.id === student.classId)?.name}</p>
                    <p>Parent : {" "} {student.parentName}</p>
                    <p>Admission Date : {" "} {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : "-"}</p>
                </div>
            </div>
        </div>
    );
}

export default MyReportCard;