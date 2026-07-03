import { useEffect, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebase/firebase";
import { Classes, Subjects } from "../../data/data";
import Navbar from "../../components/Navbar";

function TeacherMarks() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [teacher, setTeacher] = useState(null);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [examType, setExamType] = useState("Test 1");
    const [inputMarks, setInputMarks] = useState({});

    async function loadData() {
        const teacherId = localStorage.getItem("teacherId");
        const teacherSnapshot = await getDocs(collection(db,"teachers"));
        let teacherData = null;
        teacherSnapshot.forEach((doc) => {
            if(doc.id === teacherId) {
                teacherData = {
                    firebaseId: doc.id,
                    ...doc.data()
                };
            }
        });
        setTeacher(teacherData);

        if(teacherData && teacherData.classIds && teacherData.classIds.length > 0) {
            setSelectedClass(teacherData.classIds[0]);
        }
        const studentSnapshot = await getDocs(collection(db,"students"));
        const studentRows = [];
        studentSnapshot.forEach((doc) => {
            studentRows.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });
        setStudents(studentRows);

        const marksSnapshot = await getDocs(collection(db,"marks"));
        const marksRows = [];
        marksSnapshot.forEach((doc) => {
            marksRows.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });
        setMarks(marksRows);
    }

    useEffect(()=> {
        loadData();
    },[]);

    useEffect(() => {
        const filtered = students.filter((student) => Number(student.classId) === Number(selectedClass));
        if(filtered.length > 0) {
            setSelectedStudent(filtered[0].firebaseId);
        }
        else {
            setSelectedStudent("");
        }
    },[students, selectedClass]);


    function getClassName(id) {
        return (
            Classes.find((item) => item.id === Number(id))?.name || "-"
        )
    }

    function getSubjectName(id) {
        return (
            Subjects.find((item) => item.id === Number(id))?.name || "-"
        )
    }

    function isAlreadyAdded(subjectId) {
        return marks.find((item) => item.studentId === selectedStudent && Number(item.subjectId) === Number(subjectId) && item.examType === examType)
    }

    const filteredStudents = students.filter(
        (student) => Number(student.classId) === Number(selectedClass)
    )

    async function saveMarks(subjectId) {
        if (!selectedStudent) {
            return;
        }

        const alreadyAdded = isAlreadyAdded(subjectId);
        if (alreadyAdded) {
            alert("Marks already added for this exam.");
            return;
        }

        const key = `${selectedStudent}-${subjectId}`;
        const enteredMarks = Number(inputMarks[key] || 0);
        if (enteredMarks < 0 || enteredMarks > 100) {
            alert("Marks should be between 0 and 100.");
            return;
        }

        await addDoc(collection(db, "marks"),{
                studentId: selectedStudent,
                subjectId: Number(subjectId),
                examType,
                marks: enteredMarks
            }
        );

        setInputMarks((prev) => ({...prev,[key]: ""}));
        loadData();
    }

    if (!teacher) {
        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main">
                    <Navbar title="Teacher Marks" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                    <h2>Loading Details</h2>
                </div>
            </div>
        );
    }

    const teacherSubjects = teacher.subjectIds || [];
    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Teacher Marks" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
                <div className="page-header">
                    <div>
                        <h2>Teacher Marks</h2>
                        <p>Add marks for your assigned classes and subjects</p>
                    </div>
                </div>

                <div className="panel">
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            marginBottom: "20px",
                            flexWrap: "wrap"
                        }}
                    >
                        <div>
                            <label>Class</label>
                            <br />
                            <select value={selectedClass} onChange={(e) => setSelectedClass(Number(e.target.value))}>
                            {(teacher.classIds || []).map((classId) => (
                                            <option key={classId} value={classId}>{getClassName(classId)}</option>
                                        )
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label>Student</label>
                            <br />
                            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                                {filteredStudents.map((student) => (
                                            <option key={student.firebaseId} value={student.firebaseId}>{student.name}</option>
                                        )
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label>Exam</label>
                            <br />
                            <select value={examType} onChange={(e) => setExamType(e.target.value)}>
                                <option>Test 1</option>
                                <option>Test 2</option>
                                <option>Test 3</option>
                                <option>Midterm</option>
                                <option>Final Exam</option>
                            </select>
                        </div>
                    </div>
                    {teacherSubjects.map(
                            (subjectId) => {
                                const key = `${selectedStudent}-${subjectId}`;
                                const alreadyAdded = isAlreadyAdded(subjectId);
                                return (
                                    <div key={subjectId} className="subject-row">
                                        <div style={{ width: "220px" }}>
                                            <strong>{getSubjectName(subjectId)}</strong>
                                        </div>
                                        {alreadyAdded ? (
                                                <span className="status-pill present">Marks Added</span>
                                            ) : (
                                                <>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        placeholder="Enter Marks"
                                                        value={inputMarks[key] || ""}
                                                        onChange={(e) => setInputMarks((prev) => ({...prev,[key]: e.target.value}))}
                                                    />
                                                    <button onClick={() => saveMarks(subjectId)}>Save</button>
                                                </>
                                            )
                                        }
                                    </div>
                                );
                            }
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default TeacherMarks;
