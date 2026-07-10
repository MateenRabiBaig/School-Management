import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase"
import { loginUser } from "../api/authApi"
import { saveAuth } from "../utils/authStorage"

function Login() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleApiLogin() {
        const response = await loginUser({userId, password, role})
        saveAuth(response.token, response.user)
        toast.success(`Welcome back ${response.user.name}`)

        if(response.user.role === "admin") {
            navigate("/admin")
            return
        }

        if(response.user.role === "student") {
            navigate("/student")
            return
        }
    }

    async function handleTeacherLogin() {
        const snapshot = await getDocs(collection(db,"teachers"))
        let teacher = null
        snapshot.forEach((docItem) => {
            const data = docItem.data()
            const teacherIdentifier = data.teacherId || data.name

            if(teacherIdentifier === userId && data.password === password) {
                teacher = { firebaseId: docItem.id, ...data }
            }
        })

        if(!teacher) {
            throw new Error("Invalid teacher credentials")
        }
        localStorage.setItem("role","teacher")
        localStorage.setItem("user",JSON.stringify({
            id: teacher.firebaseId,
            name: teacher.name,
            role: "teacher",
            teacherId: teacherId || teacher.firebaseId,
            photo: teacher.photo || "",
        }))
        localStorage.setItem("teacherId",teacher.firebaseId)
        toast.success(`Welcome back, ${teacher.name}`)
        navigate("/teacher")
    }

    async function handleLogin() {
        if(!role) {
            toast.error("Please enter User ID and password")
            return
        }

        try {
            setLoading(true)
            if(role === "teacher") {
                await handleTeacherLogin()
            }
            else {
                await handleApiLogin()
            }
        }
        catch(error) {
            toast.error(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    function handleKeyDown(event) {
        if(event.key === "Enter") {
            handleLogin()
        }
    }

    return (
        <div className="container">
            <div className="card">
                <h1 style={{ textAlign: "center" }}>Login</h1>
                
                <input
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>

                <br/>

                <button onClick={handleLogin} style={{ width: "100%" }}>Login</button>
                {loading ? "Loggin in..." : "Login"}
            </div>
        </div>
    )
}

export default Login