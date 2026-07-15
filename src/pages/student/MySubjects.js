import { useEffect, useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Classes, Subjects } from "../../data/data";
import { getMyStudentProfile } from "../../api/studentApi";
import getNavbarUser from "../../utils/getNavbarUser";

function MySubjects() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navbarUser = getNavbarUser();

    useEffect(() => {
        loadStudent();
    }, []);

    async function loadStudent() {
        try {
            setLoading(true);
            const response = await getMyStudentProfile();
            setStudent(response.student);
        }
        catch (error) {
            toast.error("Unable to load subjects");
        }
        finally {
            setLoading(false);
        }
    }

    function getSubject(id) {
        return Subjects.find(item => item.id === Number(id));
    }

    const classData = useMemo(() => {
        if (!student) return null;
        return Classes.find(item => item.id === Number(student.classId));
    }, [student]);

    const compulsorySubjects = useMemo(() => {
        if (!classData) return [];
        return classData.compulsorySubjects.map(getSubject).filter(Boolean);
    }, [classData]);

    const optionalSubjects = useMemo(() => {
        if (!student) return [];
        return student.selectedSubjects.map(getSubject).filter(Boolean);
    }, [student]);

    const allSubjects = useMemo(() => {
        const ids = [...new Set([...(classData?.compulsorySubjects || []), ...(student?.selectedSubjects || [])])];
        return ids.map(getSubject).filter(Boolean);
    }, [classData, student]);

    if (loading) {
        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main">
                    <Navbar
                        title="My Subjects"
                        user={navbarUser}
                        onToggleSidebar={() =>
                            setSidebarOpen(prev => !prev)
                        }
                    />
                    <div className="panel">Loading Subjects...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar
                    title="My Subjects"
                    user={navbarUser}
                    onToggleSidebar={() =>
                        setSidebarOpen(prev => !prev)
                    }
                />
                <div className="page-header">
                    <div>
                        <h2>My Subjects</h2>
                        <p>Subjects assigned for your class</p>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Total Subjects</h3>
                        <h2>{allSubjects.length}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Compulsory</h3>
                        <h2>{compulsorySubjects.length}</h2>
                    </div>

                    <div className="dashboard-card">
                        <h3>Optional</h3>
                        <h2>{optionalSubjects.length}</h2>
                    </div>

                </div>
                <div className="profile-grid">
                    {allSubjects.map(subject => {
                        const isOptional = optionalSubjects.some(item => item.id === subject.id);

                        return (
                            <div key={subject.id} className="profile-section">
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        marginBottom: "14px"
                                    }}
                                >
                                    <BookOpen size={22} />
                                    <h3>{subject.name}</h3>
                                </div>

                                <div className="profile-row">
                                    <span>Subject Type</span>
                                    <strong>{isOptional ? "Optional" : "Compulsory"}</strong>
                                </div>

                                <div className="profile-row">
                                    <span>Class</span>
                                    <strong>{classData?.name}</strong>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MySubjects;