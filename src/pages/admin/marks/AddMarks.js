import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Sidebar from "../../../components/Sidebar";
import { db } from "../../../firebase/firebase";
import { Classes, Subjects } from "../../../data/data";
import Navbar from "../../../components/Navbar";
import { toast } from "react-toastify";

function AddMarks() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [inputMarks, setInputMarks] = useState({});
  const [examTypes, setExamTypes] = useState({});

  async function loadData() {
    try {
      const studentSnapshot = await getDocs(collection(db, "students"));
      const marksSnapshot = await getDocs(collection(db, "marks"));
      const studentRows = [];
      const markRows = [];

      studentSnapshot.forEach((item) => studentRows.push({ firebaseId: item.id, ...item.data() }));
      marksSnapshot.forEach((item) => markRows.push({ firebaseId: item.id, ...item.data() }));

      setStudents(studentRows);
      setMarks(markRows);
    } catch (error) {
      toast.error("Error loading data: " + error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-";
  }

  function getStudentSubjects(student) {
    const classData = Classes.find((item) => item.id === Number(student.classId));
    const compulsory = classData ? classData.compulsorySubjects : [];
    const optional = Array.isArray(student.selectedSubjects) ? student.selectedSubjects : [];
    return [...new Set([...compulsory, ...optional])];
  }

  async function saveMarks(studentId, subjectId) {
    const key = `${studentId}-${subjectId}`;
    const marksValue = inputMarks[key];
    const examType = examTypes[key] || "Test 1";

    if (marksValue === undefined || marksValue === "") {
      toast.error("Please enter marks");
      return;
    }

    try {
      await addDoc(collection(db, "marks"), {
        studentId,
        subjectId,
        examType,
        marks: Number(marksValue),
      });
      const student = students.find(s => s.firebaseId === studentId);
      const subjectName = getSubjectName(subjectId);
      toast.success(`Marks saved for ${student?.name || 'student'} - ${subjectName}`);
      setInputMarks((prev) => ({ ...prev, [key]: "" }));
      loadData();
    } catch (error) {
      toast.error("Error saving marks: " + error.message);
    }
  }

  function getClassName(id) {
    return Classes.find((item) => item.id === Number(id))?.name || "-";
  }

  return (
    <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Add Marks" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Add Marks</h2>
            <p>Store marks in the existing marks collection.</p>
          </div>
        </div>

        <div className="marks-layout">
          <div className="marks-entry-panel">
            {students.map((student) => (
              <div className="student-card" key={student.firebaseId}>
                <h4>{student.name}</h4>
                {getStudentSubjects(student).map((subjectId) => {
                  const key = `${student.firebaseId}-${subjectId}`;
                  return (
                    <div className="subject-row" key={subjectId}>
                      <span>{getSubjectName(subjectId)}</span>
                      <select
                        value={examTypes[key] || "Test 1"}
                        onChange={(e) =>
                          setExamTypes((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                      >
                        <option>Test 1</option>
                        <option>Test 2</option>
                        <option>Test 3</option>
                        <option>Midterm</option>
                        <option>Final Exam</option>
                      </select>
                      <input
                        type="number"
                        value={inputMarks[key] || ""}
                        onChange={(e) => setInputMarks((prev) => ({ ...prev, [key]: e.target.value }))}
                      />
                      <button onClick={() => saveMarks(student.firebaseId, subjectId)}>Save</button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="marks-table-panel">
            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Exam</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((item) => {
                    const student = students.find((row) => row.firebaseId === item.studentId);
                    return (
                      <tr key={item.firebaseId}>
                        <td>{student?.name || "-"}</td>
                        <td>{student ? getClassName(student.classId) : "-"}</td>
                        <td>{getSubjectName(item.subjectId)}</td>
                        <td>{item.examType}</td>
                        <td>{item.marks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMarks;
