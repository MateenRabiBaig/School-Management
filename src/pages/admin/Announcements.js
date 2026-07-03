import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

function Announcements() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const [announcements, setAnnouncements] = useState([]);

    async function loadData() {
        try {
            const result = await getDocs(collection(db,"announcements"));
            const temp=[];
            result.forEach(doc => {
                temp.push({
                    firebaseId: doc.id,
                    ...doc.data()
                });
            });
            setAnnouncements(temp);
        } catch (error) {
            toast.error("Error loading announcements: " + error.message);
        }
    }

    useEffect(()=>{
        loadData()
    },[]);

    async function addAnnouncement() {
        if (!title || !message || !type) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            await addDoc(collection(db,"announcements"),{title,message,type,active:true,createDate: new Date().toISOString()});
            toast.success("Announcement created successfully!");
            setTitle("");
            setMessage("");
            setType("");
            loadData();
        } catch (error) {
            toast.error("Error creating announcement: " + error.message);
        }
    }

    async function remove(id) {
        try {
            await deleteDoc(doc(db,"announcements",id));
            toast.success("Announcement deleted successfully!");
            loadData();
        } catch (error) {
            toast.error("Error deleting announcement: " + error.message);
        }
    }

    return (
        <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Announcements" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

                    <h2>Announcements</h2>
                    <div className="form-card">
                        <input
                            type="text"
                            value={title}
                            placeholder="Enter Title"
                            onChange={(e)=> setTitle(e.target.value)}
                        />

                        <textarea
                            value={message}
                            placeholder="Enter message"
                            onChange={(e)=>setMessage(e.target.value)}
                        />

                        <select value={type} onChange={(e)=>setType(e.target.value)}>
                            <option>General</option>
                            <option>Exam</option>
                            <option>Holiday</option>
                        </select>

                        <button onClick={addAnnouncement}>Create</button>

                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {announcements.map(
                                    item=>(
                                        <tr key={item.firebaseId}>
                                            <td>{item.title}</td>
                                            <td>{item.type}</td>
                                            <td>{item.createDate}</td>
                                            <td><button onClick={() => remove(item.firebaseId)}>Delete</button></td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    )
}

export default Announcements;
