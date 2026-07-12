import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getStudentReportCard } from "../../api/resultApi";
import getNavbarUser from "../../utils/getNavbarUser";
import { toast } from "react-toastify";
import { Subjects } from "../../data/data";
import ReportCardPDF from "../../components/reportCard/ReportCardPDF";
import { prepareReportCard } from "../../utils/reportCardUtils";

function MyResults() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportData,setReportData] = useState(null);
  const navbarUser = getNavbarUser();
  const userId = navbarUser?.id;

  useEffect(() => {
    async function loadMarks() {
      if (!userId) {
        return;
      }

      try {
        const response = await getStudentReportCard(userId);
        setReportData(response);
      }
      catch (error) {
        toast.error("Error loading results: " + error.message);
      }
    }

    loadMarks();
  }, [userId]);

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-";
  }

  const groupedResults = {};

  (reportData?.results || []).forEach((result) => {

    if (!groupedResults[result.examType]) {
      groupedResults[result.examType] = [];
    }
    groupedResults[result.examType].push(result);
  });

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="My Results" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>My Results</h2>
            <p>View subject-wise marks and result summary</p>
          </div>
        </div>

        {Object.keys(groupedResults).length === 0 ? (
          <div className="panel">No results found</div>
        ) : (
          Object.keys(groupedResults).map((examType) => {
            const examResults = groupedResults[examType];
            const summary = examResults[0];
            const report = prepareReportCard({
              student: reportData.student,
              attendancePercentage: reportData.attendancePercentage,
              result: summary,
            });

            return (
              <div className="result-card" key={examType}>
                <h3>{examType}</h3>

                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Maximum Marks</th>
                    </tr>
                  </thead>

                  <tbody>
                    {examResults.flatMap((record) =>
                      (record.subjects || []).map((subject) => (
                        <tr key={`${record.id}-${subject.subjectId}`}>
                          <td>{getSubjectName(subject.subjectId)}</td>
                          <td>{subject.marks}</td>
                          <td>{subject.maxMarks}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="summary-box">
                  <p>Total : {summary.obtained}/{summary.total}</p>
                  <p>Percentage : {summary.percentage}%</p>
                  <p>Grade : {summary.grade}</p>
                  <p>Status : {summary.status}</p>
                  <p>Attendance : {reportData?.attendancePercentage}%</p>
                </div>

                <ReportCardPDF report={report} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyResults;
