import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Classes, Subjects } from "../../../data/data";
import { getStudents, getStudentById } from "../../../api/studentApi";
import { getMarksById, saveMarks } from "../../../api/marksApi";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";

function AddMarks() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [examType, setExamType] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [remarks, setRemarks] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [searchParams] = useSearchParams();
  const navbarUser = getNavbarUser();
  const editId = searchParams.get("id");

  async function loadStudents(classId) {
    if (!classId) {
      setStudents([]);
      setSelectedStudent("");
      setStudentData(null);
      setSubjects([]);
      return;
    }

    try {
      const response = await getStudents({
        classId,
      });

      setStudents(response.students || []);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function selectStudent(id) {
    if (!id) {
      setStudentData(null);
      return;
    }

    try {
      setLoading(true);

      const response = await getStudentById(id);
      setStudentData(response.student);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!studentData) {
      setSubjects([]);
      return;
    }

    const classData = Classes.find((item) => item.id === Number(studentData.classId));

    if (!classData) {
      setSubjects([]);
      return;
    }

    const studentSubjects = [
      ...classData.compulsorySubjects,
      ...(Array.isArray(studentData.selectedSubjects) ? studentData.selectedSubjects : []),
    ];

    const uniqueSubjects = [...new Set(studentSubjects)];

      setSubjects(
        uniqueSubjects.map((id) => ({
          subjectId: id,
          marks: "",
          maxMarks: 100,
        }))
      );
  }, [studentData]);

  useEffect(() => {
    async function loadExistingMarks() {
      if (!editId) {
        return;
      }

      try {
        setLoading(true);

        const response = await getMarksById(editId);
        const marksData = response.marks;

        setSelectedClass(marksData.student?.classId ? String(marksData.student.classId) : "");
        setSelectedStudent(marksData.student?._id || marksData.student?.id || "");
        setExamType(marksData.examType || "");
        setAcademicYear(marksData.academicYear || "2026-27");
        setRemarks(marksData.remarks || "");
        setStudentData(marksData.student || null);
        setSubjects(
          (marksData.subjects || []).map((subject) => ({
            subjectId: subject.subjectId,
            marks: subject.marks,
            maxMarks: subject.maxMarks || 100,
          }))
        );
      } catch (error) {
        toast.error("Error loading marks: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    loadExistingMarks();
  }, [editId]);

  function updateMarks(index, field, value) {
    setSubjects((previous) => {
      const updated = [...previous];

      updated[index] = {
        ...updated[index],
        [field]: Number(value),
      };

      return updated;
    });
  }

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-";
  }

  const selectedStudentName = useMemo(
    () => students.find((student) => student.id === selectedStudent)?.name || "",
    [students, selectedStudent]
  );

  async function handleSave() {
    if (!selectedStudent || !examType || !academicYear) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      await saveMarks({
        studentId: selectedStudent,
        examType,
        academicYear,
        subjects,
        remarks,
      });

      toast.success("Marks saved successfully.");
    } catch (error) {
      toast.error("Error saving marks: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="Add Marks" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>{editId ? "Edit Marks" : "Add Marks"}</h2>
            <p>Select a class, student, exam and enter marks</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-bottom">
            <select
              value={selectedClass}
              onChange={(event) => {
                setSelectedClass(event.target.value);
                loadStudents(event.target.value);
                setSelectedStudent("");
                setStudentData(null);
              }}
            >
              <option value="">Select Class</option>
              {Classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStudent}
              onChange={(event) => {
                setSelectedStudent(event.target.value);
                selectStudent(event.target.value);
              }}
              disabled={!selectedClass}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>

            <select value={examType} onChange={(event) => setExamType(event.target.value)} disabled={!selectedStudent}>
              <option value="">Select Exam</option>
              <option value="Test 1">Test 1</option>
              <option value="Test 2">Test 2</option>
              <option value="Test 3">Test 3</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
            </select>

            <input
              type="text"
              value={academicYear}
              onChange={(event) => setAcademicYear(event.target.value)}
              placeholder="Academic Year"
            />

            <textarea
              placeholder="Remarks"
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
            />
          </div>

          {loading ? (
            <div className="panel">Loading student...</div>
          ) : studentData ? (
            <>
              <div className="panel">
                <strong>Student:</strong> {studentData.name || selectedStudentName}
              </div>

              <div className="table-card">
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Maximum Marks</th>
                    </tr>
                  </thead>

                  <tbody>
                    {subjects.map((subject, index) => (
                      <tr key={subject.subjectId}>
                        <td>{getSubjectName(subject.subjectId)}</td>
                        <td>
                          <input
                            type="number"
                            value={subject.marks}
                            onChange={(event) => updateMarks(index, "marks", event.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={subject.maxMarks}
                            onChange={(event) => updateMarks(index, "maxMarks", event.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <div className="panel">Select a student to load subjects</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddMarks;
