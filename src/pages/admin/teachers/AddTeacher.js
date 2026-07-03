import { useMemo, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { db } from "../../../firebase/firebase";
import { Classes, Subjects } from "../../../data/data";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  password: "",
  classIds: [],
  subjectIds: [],
  active: true,
  photo: "",
};

function AddTeacher() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();

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

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePhotoChange(file) {
    if (!file) {
      updateField("photo", "");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateField("photo", reader.result);
    reader.readAsDataURL(file);
  }

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

  async function handleSubmit() {
    if (!form.name || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addDoc(collection(db, "teachers"), {
        ...form,
        classIds: form.classIds.map(Number),
        subjectIds: form.subjectIds.map(Number),
        active: Boolean(form.active),
      });
      toast.success("Teacher added successfully!");
      navigate("/admin/teachers");
    } catch (error) {
      toast.error("Error adding teacher: " + error.message);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main">
        <Navbar
          title="Add Teacher"
          user={{
            name: localStorage.getItem("user") || "User",
            role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1),
          }}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="page-header">
          <div>
            <h2>Add Teacher</h2>
            <p>Create a teacher profile</p>
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
                {form.photo ? <img src={form.photo} alt="Teacher preview" /> : <div className="photo-upload-placeholder">Choose Photo</div>}
              </div>
              <span>Upload Photo</span>
            </label>

            <div className="student-top-fields">
              <input placeholder="Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              <input placeholder="Password" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
            </div>
          </div>

          <div className="student-form-bottom">
            <label className="checkbox-row">
              <input type="checkbox" checked={form.active} onChange={(e) => updateField("active", e.target.checked)} />
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

          <button onClick={handleSubmit}>Save Teacher</button>
        </div>
      </div>
    </div>
  );
}

export default AddTeacher;
