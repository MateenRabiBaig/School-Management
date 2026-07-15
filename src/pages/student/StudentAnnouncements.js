import { useEffect, useState } from "react";
import { Megaphone, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getAnnouncements } from "../../api/announcementApi";
import getNavbarUser from "../../utils/getNavbarUser";

function StudentAnnouncements() {
    const navbarUser = getNavbarUser();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        loadAnnouncements();
    }, []);

    async function loadAnnouncements() {
        try {
            setLoading(true);
            const response = await getAnnouncements();
            setAnnouncements(response.announcements || []);
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar
                    title="Announcements"
                    user={navbarUser}
                    onToggleSidebar={() =>
                        setSidebarOpen(prev => !prev)
                    }
                />
                <div className="page-header">
                    <div>
                        <h2>Announcements</h2>
                        <p>Latest announcements from school administration</p>
                    </div>
                </div>
                {loading ? (
                    <div className="panel">Loading announcements...</div>
                ) : announcements.length === 0 ? (
                    <div className="panel empty-state">
                        <Megaphone size={60} />
                        <h3>No Announcements</h3>
                        <p>There are no announcements available</p>
                    </div>
                ) : (
                    <div className="announcement-list">
                        {announcements.map(item => (
                            <div className="announcement-card" key={item.id}>
                                <div className="announcement-top">
                                    <div>
                                        <h3>{item.title}</h3>
                                        <div className="announcement-date">
                                            <CalendarDays size={16} />
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <span className={`badge ${item.audience.toLowerCase()}`}>{item.audience}</span>
                                </div>
                                <div className="announcement-description">{item.description}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentAnnouncements;