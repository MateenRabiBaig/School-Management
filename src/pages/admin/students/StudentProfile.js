import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { UserRound } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import { db } from "../../../firebase/firebase";
import { Classes } from "../../../data/data";
import Navbar from "../../../components/Navbar";
import { toast } from "react-toastify";

const emptyStudent = {
  name: "",
  password: "",
  classId: "",
  selectedSubjects: [],
  gender: "",
  dob: "",
  mobile: "",
  parentName: "",
  parentContact: "",
  address: "",
  admissionDate: "",
  active: true,
  photo: "",
};

function StudentProfile() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState(emptyStudent);

  const editing = searchParams.get("mode") === "edit";

  useEffect(() => {
    async function loadStudent() {
      try {
        const snapshot = await getDoc(doc(db, "students", id));
        if (!snapshot.exists()) {
          toast.error("Student not found");
          return;
        }
        const data = snapshot.data();
        setStudent({ firebaseId: snapshot.id, ...data });
        setForm({
          ...emptyStudent,
          ...data,
          classId: data.classId ? String(data.classId) : "",
          selectedSubjects: Array.isArray(data.selectedSubjects) ? data.selectedSubjects.map(Number) : [],
        });
      } catch (error) {
        toast.error("Error loading student: " + error.message);
      }
    }
    loadStudent();
  }, [id]);

  const className = useMemo(() => {
    const classData = Classes.find((item) => item.id === Number(form.classId || student?.classId));
    return classData?.name || "-";
  }, [form.classId, student?.classId]);

  async function handleSave() {
    if (!form.name || !form.password || !form.classId || !form.gender || !form.mobile) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await updateDoc(doc(db, "students", id), {
        ...form,
        classId: Number(form.classId),
        selectedSubjects: form.selectedSubjects.map(Number),
        active: Boolean(form.active),
      });
      toast.success("Student updated successfully!");
      navigate("/admin/students");
    } catch (error) {
      toast.error("Error updating student: " + error.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteDoc(doc(db, "students", id));
      toast.success("Student deleted successfully!");
      navigate("/admin/students");
    } catch (error) {
      toast.error("Error deleting student: " + error.message);
    }
  }

  function handlePhotoChange(file) {
    if (!file) {
      setForm((prev) => ({ ...prev, photo: "" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  if (!student) {
    return (
      <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Student Profile" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <div className="panel">Loading student profile</div>
        </div>
      </div>
    );
  }

  if (!editing) {
    return (
      <div className="wrapper">
        <Sidebar isOpen={sidebarOpen} />
                <Navbar title="Student Profile" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="main">
          <div className="page-header">
            <div>
              <h2>Student Profile</h2>
              <p>{student.name}</p>
            </div>
            <div>
              <button onClick={() => navigate(`/admin/students/${id}?mode=edit`)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>

          <div className="profile-card">
            {student.photo ? (
              <img className="profile-photo" src={student.photo} alt={student.name} />
            ) : (
              <div className="profile-photo placeholder-photo">
                <UserRound size={38} />
              </div>
            )}
            <div className="profile-details">
              <div><strong>Name:</strong> {student.name || "-"}</div>
              <div><strong>Class:</strong> {className}</div>
              <div><strong>Gender:</strong> {student.gender || "-"}</div>
              <div><strong>DOB:</strong> {student.dob || "-"}</div>
              <div><strong>Mobile:</strong> {student.mobile || "-"}</div>
              <div><strong>Parent Name:</strong> {student.parentName || "-"}</div>
              <div><strong>Parent Contact:</strong> {student.parentContact || "-"}</div>
              <div><strong>Admission Date:</strong> {student.admissionDate || "-"}</div>
              <div><strong>Active:</strong> {student.active === false ? "No" : "Yes"}</div>
              <div><strong>Address:</strong> {student.address || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />
                <Navbar title="Student Profile" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="main">
        <div className="page-header">
          <div>
            <h2>Edit Student Profile</h2>
            <p>Update the student details</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-top">
            <label className="photo-upload-card">
              <input
                type="file"
                accept="image/*"
                className="photo-upload-input"
                onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              />
              <div className="photo-upload-preview">
                {form.photo ? (
                  <img src={form.photo} alt={student.name} />
                ) : (
                  <div className="photo-upload-placeholder">
                    Choose Photo
                  </div>
                )}
              </div>
              <span>Upload Photo</span>
            </label>

            <div className="student-top-fields">
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              <input value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            </div>
          </div>

          <div className="student-form-bottom">
            <input value={form.classId} onChange={(e) => setForm((prev) => ({ ...prev, classId: e.target.value }))} />
            <input value={form.gender} onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))} />
            <input type="date" value={form.dob} onChange={(e) => setForm((prev) => ({ ...prev, dob: e.target.value }))} />
            <input value={form.mobile} onChange={(e) => setForm((prev) => ({ ...prev, mobile: e.target.value }))} />
            <input value={form.parentName} onChange={(e) => setForm((prev) => ({ ...prev, parentName: e.target.value }))} />
            <input value={form.parentContact} onChange={(e) => setForm((prev) => ({ ...prev, parentContact: e.target.value }))} />
            <input type="date" value={form.admissionDate} onChange={(e) => setForm((prev) => ({ ...prev, admissionDate: e.target.value }))} />
            <textarea value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
            <label className="checkbox-row">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))} />
              Active
            </label>
          </div>
          <button onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
