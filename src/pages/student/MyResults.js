import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getStudentMarks } from "../../api/marksApi";
import { calculateResult } from "../../utils/resultUtils";
import getNavbarUser from "../../utils/getNavbarUser";
import { toast } from "react-toastify";
import { Subjects } from "../../data/data";

function MyResults() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [marks, setMarks] = useState([]);
  const navbarUser = getNavbarUser();
  const userId = navbarUser?.id;

  useEffect(() => {
    async function loadMarks() {
      if (!userId) {
        return;
      }

      try {
        const response = await getStudentMarks(userId);
        setMarks(response.marks || []);
      } catch (error) {
        toast.error("Error loading results: " + error.message);
      }
    }

    loadMarks();
  }, [userId]);

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-";
  }

  const groupedMarks = {};

  marks.forEach((item) => {
    if (!groupedMarks[item.examType]) {
      groupedMarks[item.examType] = [];
    }

    groupedMarks[item.examType].push(item);
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

        {Object.keys(groupedMarks).length === 0 ? (
          <div className="panel">No results found</div>
        ) : (
          Object.keys(groupedMarks).map((examType) => {
            const examMarks = groupedMarks[examType];
            const result = calculateResult(
              examMarks.flatMap((record) => record.subjects || [])
            );

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
                    {examMarks.flatMap((record) =>
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
                  <p>Total : {result.obtained}/{result.total}</p>
                  <p>Percentage : {result.percentage}%</p>
                  <p>Grade : {result.grade}</p>
                  <p>Status : {result.status}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyResults;
