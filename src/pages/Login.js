import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { toast } from "react-toastify";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();

    async function handleLogin() {
        if (!role) {
            toast.error("Please select a role");
            return;
        }
        if (!name || !password) {
            toast.error("Please enter both name and password");
            return;
        }

        if (role === "admin") {
            if (name === "admin" && password === "admin@123") {
                localStorage.setItem("role", "admin");
                localStorage.setItem("user", name);
                toast.success("Admin login successful!");
                navigate("/admin");
            }
            else {
                toast.error("Invalid admin credentials");
            }
        }
        else if (role === "student") {
            const query = await getDocs(collection(db,"students"));
            let found = false;
            query.forEach((docItem)=>{
                const data = docItem.data();
                if(data.name === name && data.password === password) {
                    localStorage.setItem("role", "student");
                    localStorage.setItem("user", name);
                    localStorage.setItem("studentId",docItem.id);
                    found = true;
                    toast.success(`Welcome back, ${name}!`);
                    navigate("/student");
                }
            })
            if (!found) {
                toast.error("Invalid student credentials");
            }
        }
        else {
            const query = await getDocs(collection(db,"teachers"));
            let found = false;
            query.forEach((docItem)=>{
                const data = docItem.data();
                if(data.name === name && data.password === password) {
                    localStorage.setItem("role", "teacher");
                    localStorage.setItem("user", name);
                    localStorage.setItem("teacherId",docItem.id);
                    found = true;
                    toast.success(`Welcome back, ${name}!`);
                    navigate("/teacher");
                }
            })
            if (!found) {
                toast.error("Invalid teacher credentials");
            }
        }
    };

    return (
        <>
            <div className="container">
            <div className="card">
            <h1 style={{ textAlign: "center" }}>Login</h1>

            <input
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <select onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>

            <br/>

            <button onClick={handleLogin} style={{ width: "100%" }}>Login</button>
            </div>
            </div>
        </>
    )
}

export default Login;
