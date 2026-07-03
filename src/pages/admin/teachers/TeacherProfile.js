import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { UserRound } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { db } from "../../../firebase/firebase";
import { Classes, Subjects } from "../../../data/data";
import { toast } from "react-toastify";

const emptyTeacher = {
  name: "",
  password: "",
  classIds: [],
  subjectIds: [],
  active: true,
  photo: "",
};

function TeacherProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [form, setForm] = useState(emptyTeacher);

  const editing = searchParams.get("mode") === "edit";

  useEffect(() => {
    async function loadTeacher() {
      try {
        const snapshot = await getDoc(doc(db, "teachers", id));
        if (!snapshot.exists()) {
          toast.error("Teacher not found");
          return;
        }
        const data = snapshot.data();
        setTeacher({ firebaseId: snapshot.id, ...data });
        setForm({
          ...emptyTeacher,
          ...data,
          classIds: Array.isArray(data.classIds) ? data.classIds.map(Number) : [],
          subjectIds: Array.isArray(data.subjectIds) ? data.subjectIds.map(Number) : [],
        });
      } catch (error) {
        toast.error("Error loading teacher: " + error.message);
      }
    }
    loadTeacher();
  }, [id]);

  const classNames = useMemo(() => {
    return (form.classIds || []).map((classId) => Classes.find((item) => item.id === Number(classId))?.name || "-").join(", ");
  }, [form.classIds]);

  const selectedClasses = useMemo(
    () => Classes.filter((item) => form.classIds.map(Number).includes(item.id)),
    [form.classIds]
  );

  const availableSubjectIds = useMemo(() => {
    const subjectIds = new Set();
    selectedClasses.forEach((classItem) => {
      classItem.compulsorySubjects.forEach((subjectId) => subjectIds.add(subjectId));
      classItem.optionalSubjects.forEach((group) => group.subjects.forEach((subjectId) => subjectIds.add(subjectId)));
    });
    return [...subjectIds];
  }, [selectedClasses]);

  const availableSubjects = useMemo(
    () => Subjects.filter((item) => availableSubjectIds.includes(item.id)),
    [availableSubjectIds]
  );

  const subjectNames = useMemo(() => {
    return (form.subjectIds || []).map((subjectId) => Subjects.find((item) => item.id === Number(subjectId))?.name || "-").join(", ");
  }, [form.subjectIds]);

  function toggleClass(classId) {
    setForm((prev) => {
      const current = prev.classIds.map(Number);
      const next = current.includes(classId) ? current.filter((item) => item !== classId) : [...current, classId];
      const nextClassItems = Classes.filter((item) => next.includes(item.id));
      const allowedSubjectIds = new Set();
      nextClassItems.forEach((classItem) => {
        classItem.compulsorySubjects.forEach((subjectId) => allowedSubjectIds.add(subjectId));
        classItem.optionalSubjects.forEach((group) => group.subjects.forEach((subjectId) => allowedSubjectIds.add(subjectId)));
      });
      const prunedSubjects = prev.subjectIds.filter((subjectId) => allowedSubjectIds.has(subjectId));
      return { ...prev, classIds: next, subjectIds: prunedSubjects };
    });
  }

  function toggleSubject(subjectId) {
    setForm((prev) => {
      const current = prev.subjectIds.map(Number);
      const next = current.includes(subjectId) ? current.filter((item) => item !== subjectId) : [...current, subjectId];
      return { ...prev, subjectIds: next };
    });
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

  async function handleSave() {
    if (!form.name || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await updateDoc(doc(db, "teachers", id), {
        ...form,
        classIds: form.classIds.map(Number),
        subjectIds: form.subjectIds.map(Number),
        active: Boolean(form.active),
      });
      toast.success("Teacher updated successfully!");
      navigate("/admin/teachers");
    } catch (error) {
      toast.error("Error updating teacher: " + error.message);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await deleteDoc(doc(db, "teachers", id));
      toast.success("Teacher deleted successfully!");
      navigate("/admin/teachers");
    } catch (error) {
      toast.error("Error deleting teacher: " + error.message);
    }
  }

  if (!teacher) {
    return (
      <div className="wrapper">
        <Sidebar isOpen={sidebarOpen} />
        <div className="main">
          <Navbar
            title="Teacher Profile"
            user={{
              name: localStorage.getItem("user") || "User",
              role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1),
            }}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
          <div className="panel">Loading teacher profile</div>
        </div>
      </div>
    );
  }

  if (!editing) {
    return (
      <div className="wrapper">
        <Sidebar isOpen={sidebarOpen} />
        <div className="main">
          <Navbar
            title="Teacher Profile"
            user={{
              name: localStorage.getItem("user") || "User",
              role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1),
            }}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />

          <div className="page-header">
            <div>
              <h2>Teacher Profile</h2>
              <p>{teacher.name}</p>
            </div>
            <div>
              <button onClick={() => navigate(`/admin/teachers/${id}?mode=edit`)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          </div>

          <div className="profile-card">
            {teacher.photo ? (
              <img className="profile-photo" src={teacher.photo} alt={teacher.name} />
            ) : (
              <div className="profile-photo placeholder-photo">
                <UserRound size={38} />
              </div>
            )}
            <div className="profile-details">
              <div><strong>Name:</strong> {teacher.name || "-"}</div>
              <div><strong>Classes:</strong> {classNames || "-"}</div>
              <div><strong>Subjects:</strong> {subjectNames || "-"}</div>
              <div><strong>Active:</strong> {teacher.active === false ? "No" : "Yes"}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main">
        <Navbar
          title="Teacher Profile"
          user={{
            name: localStorage.getItem("user") || "User",
            role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1),
          }}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="page-header">
          <div>
            <h2>Edit Teacher Profile</h2>
            <p>Update teacher details</p>
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
                {form.photo ? <img src={form.photo} alt={form.name || "Teacher preview"} /> : <div className="photo-upload-placeholder">Choose Photo</div>}
              </div>
              <span>Upload Photo</span>
            </label>

            <div className="student-top-fields">
              <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              <input value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            </div>
          </div>

          <div className="student-form-bottom">
            <label className="checkbox-row">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))} />
              Active
            </label>
          </div>

          <div className="subject-block">
            <h3>Assign Classes</h3>
            <div className="subject-columns">
              <div>
                <h4>Classes</h4>
                {Classes.map((item) => (
                  <label key={item.id} className="subject-checkbox">
                    <input
                      type="checkbox"
                      checked={form.classIds.map(Number).includes(item.id)}
                      onChange={() => toggleClass(item.id)}
                    />
                    {item.name}
                  </label>
                ))}
              </div>

              <div>
                <h4>Subjects</h4>
                {availableSubjects.map((item) => (
                  <label key={item.id} className="subject-checkbox">
                    <input
                      type="checkbox"
                      checked={form.subjectIds.map(Number).includes(item.id)}
                      onChange={() => toggleSubject(item.id)}
                    />
                    {item.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;
