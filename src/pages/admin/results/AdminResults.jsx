import { useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { getResults } from "../../../api/resultApi";
import { getAcademicYears } from "../../../api/academicYearApi";
import { Classes } from "../../../data/data";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";

function AdminResults() {
  const navigate = useNavigate();
  const navbarUser = getNavbarUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [search, setSearch] = useState("");
  const examTypes = ["Test 1", "Test 2", "Test 3", "Midterm", "Final"];

  useEffect(() => {
    loadAcademicYears();
  }, []);

  useEffect(() => {
    loadResults();
  }, [selectedClass, selectedExam, selectedYear]);

  useEffect(() => {
    const keyword = search.toLowerCase();

    const data = results.filter((item) => {
      return (
        (item.student?.name || "").toLowerCase().includes(keyword) ||
        (item.student?.studentId || "").toLowerCase().includes(keyword)
      );
    });

    setFilteredResults(data);
  }, [search, results]);

  const displayedResults = useMemo(() => {
    return search ? filteredResults : results;
  }, [results, filteredResults, search]);

  async function loadAcademicYears() {
    try {
      const response = await getAcademicYears();
      setAcademicYears(response.academicYears || []);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function loadResults() {
    try {
      setLoading(true);

      const response = await getResults({
        classId: selectedClass,
        examType: selectedExam,
        academicYear: selectedYear,
      });

      setResults(response.results || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function getClassName(classId) {
    return Classes.find((item) => item.id === Number(classId))?.name || classId;
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="Results" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Student Results</h2>
            <p>View student results and download report cards</p>
          </div>
        </div>

        <div className="panel">
          <div className="filters">
            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
              <option value="">All Classes</option>

              {Classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select value={selectedExam} onChange={(event) => setSelectedExam(event.target.value)}>
              <option value="">All Exams</option>

              {examTypes.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>

            <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
              <option value="">Academic Year</option>

              {academicYears.map((year) => (
                <option key={year.id} value={year.name}>
                  {year.name}
                </option>
              ))}
            </select>

            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search Student..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="panel">
          {loading ? (
            <p>Loading...</p>
          ) : displayedResults.length === 0 ? (
            <p>No Results Found</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Exam</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Attendance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {displayedResults.map((item) => {
                  const report = prepareReportCard({
                    student: item.student,
                    attendancePercentage: item.attendancePercentage,
                    result: item,
                  });

                  return (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={
                            item.student.photo?.url ||
                            "https://api.dicebear.com/10.x/thumbs/svg?seed=student"
                          }
                          alt={item.student.name}
                          className="table-avatar"
                        />
                      </td>

                      <td>{item.student.studentId}</td>
                      <td>{item.student.name}</td>
                      <td>{getClassName(item.student.classId)}</td>
                      <td>{item.examType}</td>
                      <td>{item.percentage}%</td>
                      <td>
                        <span className={`grade grade-${item.grade.replace("+", "plus")}`}>
                          {item.grade}
                        </span>
                      </td>
                      <td>{item.attendancePercentage}%</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-primary" onClick={() => navigate(`/admin/report-card/${item.id}`)}>
                            <Eye size={16} />
                            View Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminResults;
