import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Classes, Subjects } from "../../data/data";
import { getMyTeacherProfile } from "../../api/teacherApi";
import { getStudents } from "../../api/studentApi";
import { saveMarks } from "../../api/marksApi";
import getNavbarUser from "../../utils/getNavbarUser";
import { toast } from "react-toastify";

function TeacherMarks() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [examType, setExamType] = useState("Test 1");
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [remarks, setRemarks] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const navbarUser = getNavbarUser();

  useEffect(() => {
    async function loadTeacher() {
      try {
        const response = await getMyTeacherProfile();
        const teacherData = response.teacher || null;

        setTeacher(teacherData);

        const classId = teacherData?.assignedClasses?.[0] || "";
        setSelectedClass(classId ? String(classId) : "");
      } catch (error) {
        toast.error("Error loading teacher: " + error.message);
      }
    }

    loadTeacher();
  }, []);

  useEffect(() => {
    async function loadStudentsForClass() {
      if (!selectedClass) {
        setStudents([]);
        setSelectedStudent("");
        setStudentData(null);
        setSubjects([]);
        return;
      }

      try {
        const response = await getStudents({
          classId: selectedClass,
        });

        setStudents(response.students || []);
      } catch (error) {
        toast.error("Error loading students: " + error.message);
      }
    }

    if (teacher) {
      loadStudentsForClass();
    }
  }, [selectedClass, teacher]);

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

  async function selectStudent(id) {
    const student = students.find((item) => item.id === id);
    setSelectedStudent(id);
    setStudentData(student || null);
  }

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

  function getClassName(id) {
    return Classes.find((item) => item.id === Number(id))?.name || "-";
  }

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-";
  }

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
      navigate("/teacher/marks");
    } catch (error) {
      toast.error("Error saving marks: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  if (!teacher) {
    return (
      <div className="wrapper">
        <Sidebar isOpen={sidebarOpen} />

        <div className="main">
          <Navbar title="Teacher Marks" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
          <div className="panel">Loading Details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="Teacher Marks" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Teacher Marks</h2>
            <p>Add marks for your assigned classes and subjects</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-bottom">
            <select value={selectedClass} onChange={(event) => setSelectedClass(event.target.value)}>
              <option value="">Select Class</option>
              {(teacher.assignedClasses || []).map((classId) => (
                <option key={classId} value={classId}>
                  {getClassName(classId)}
                </option>
              ))}
            </select>

            <select
              value={selectedStudent}
              onChange={(event) => selectStudent(event.target.value)}
              disabled={!selectedClass}
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>

            <select value={examType} onChange={(event) => setExamType(event.target.value)}>
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
          ) : (
            <div className="panel">Select a student to load subjects</div>
          )}

          <button onClick={handleSave} disabled={saving || !selectedStudent}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherMarks;
