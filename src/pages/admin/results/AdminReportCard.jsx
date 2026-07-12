import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { getResultById } from "../../../api/resultApi";
import { prepareReportCard } from "../../../utils/reportCardUtils";
import ReportCardPDF from "../../../components/reportCard/ReportCardPDF";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";

const navbarUser = getNavbarUser();
const navigate = useNavigate();
const { id } = useParams();
const [sidebarOpen, setSidebarOpen] = useState(true);
const [report,setReport] = useState(null);
const [loading,setLoading] = useState(true);

useEffect(() => {
    loadReport();
}, [id]);

async function loadReport() {
    try {
        const response = await getResultById(id);
        setReport(prepareReportCard(
            {
                student: response.result.student,
                attendancePercentage: response.result.attendancePercentage,
                result: response.result
            })
        );
    }
    catch(error) {
        toast.error(error.message);
    }
    finally {
        setLoading(false);
    }
}

function AdminReportCard() {
    if (loading) {
        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main">
                    <Navbar
                        title="Report Card"
                        user={navbarUser}
                        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
                    />
                    <div className="panel">Loading Report...</div>
                </div>
            </div>
        );
    }

    if (!report) {
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
                    <div className="panel">
                        <h2>Report Not Found</h2>
                        <button className="btn btn-primary" onClick={() => navigate("/admin/results")}>Back</button>
                    </div>
                </div>
            </div>
        );
    }

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
                <div className="page-header">
                    <div>
                        <h2>Student Report Card</h2>
                        <p>View and download report card</p>
                    </div>
                    <div style={{ display: "flex", gap: "12px"}}>
                        <button className="btn btn-secondary" onClick={() => navigate("/admin/results")}>Back</button>
                        <ReportCardPDF report={report} />
                    </div>
                </div>

                <div className="panel">
                    <div className="profile-card">
                        <img
                            src={
                                report.student.photo?.url ||
                                "https://api.dicebear.com/10.x/thumbs/svg?seed=student"
                            }
                            alt={report.student.name}
                            className="profile-photo"
                        />

                        <div className="profile-details">
                            <h2>{report.student.name}</h2>
                            <p>
                                <strong>Student ID :</strong>
                                {" "}
                                {report.student.studentId}
                            </p>
                            <p>
                                <strong>Class :</strong>
                                {" "}
                                {report.student.classId}
                            </p>
                            <p>
                                <strong>Academic Year :</strong>
                                {" "}
                                {report.academicYear}
                            </p>
                            <p>
                                <strong>Exam :</strong>
                                {" "}
                                {report.examType}
                            </p>
                            <p>
                                <strong>Gender :</strong>
                                {" "}
                                {report.student.gender || "-"}
                            </p>
                            <p>
                                <strong>Parent :</strong>
                                {" "}
                                {report.student.parentName || "-"}
                            </p>
                            <p>
                                <strong>Contact :</strong>
                                {" "}
                                {report.student.parentContact || "-"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <h3>Subject Marks</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Marks</th>
                                <th>Maximum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.subjects.map(subject => (
                                <tr key={subject.subjectId}>
                                    <td>{subject.subjectName}</td>
                                    <td>{subject.marks}</td>
                                    <td>{subject.maxMarks}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Total</h3>
                        <h2>{report.obtained} / {report.total}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Percentage</h3>
                        <h2>{report.percentage}%</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Grade</h3>
                        <h2>{report.grade}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Attendance</h3>
                        <h2>{report.attendancePercentage}%</h2>
                    </div>

                </div>

                <div className="panel">
                    <h3>Final Result</h3>
                    <div className="summary-box">
                        <p>
                            <strong>Status :</strong>
                            {" "}
                            {report.status}
                        </p>
                        <p>
                            <strong>Teacher Remarks :</strong>
                            {" "}
                            Excellent academic performance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminReportCard