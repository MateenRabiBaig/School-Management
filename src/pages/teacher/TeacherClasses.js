import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Classes, Subjects } from "../../data/data";
import { getTeacherClasses } from "../../api/teacherApi";
import getNavbarUser from "../../utils/getNavbarUser";

function TeacherClasses() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [assignedSubjects, setAssignedSubjects] = useState([]);
    const navbarUser = getNavbarUser();

    async function loadTeacherClasses() {
        try {
            setLoading(true);
            const response = await getTeacherClasses();
            setAssignedClasses(response.assignedClasses || []);
            setAssignedSubjects(response.assignedSubjects || []);
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        loadTeacherClasses();
    },[]);

    if (loading) {
        return (
            <div className="wrapper">
                <Sidebar isOpen={sidebarOpen} />
                <div className="main">
                    <Navbar
                        title="My Classes"
                        user={navbarUser}
                        onToggleSidebar={() =>
                            setSidebarOpen(prev => !prev)
                        }
                    />
                    
                    <div className="panel">Loading Classes...</div>
                </div>
            </div>
        );
    }


    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="My Classes" user={navbarUser} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

                <h2>My Classes</h2>
                {assignedClasses.map(classId => {
                    const classData = Classes.find(item => Number(item.id) === Number(classId));
                    const subjectNames = assignedSubjects.map(subjectId => Subjects.find(subject => Number(subject.id) === Number(subjectId))?.name).filter(Boolean).join(", ");
                    
                    return (
                        <div key={classId} className="class-card">
                            <h3>{classData?.name}</h3>
                            <p>
                                <strong>Subjects:</strong>{" "} {subjectNames}
                            </p>
                            <p>
                                <strong>Total Subjects:</strong>{" "} {assignedSubjects.length}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default TeacherClasses;