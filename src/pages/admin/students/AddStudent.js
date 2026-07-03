import { useMemo, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { db } from "../../../firebase/firebase";
import { Classes, Subjects } from "../../../data/data";
import Navbar from "../../../components/Navbar";
import { toast } from "react-toastify";

const initialForm = {
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

function AddStudent() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();

  const selectedClass = useMemo(
    () => Classes.find((item) => item.id === Number(form.classId)),
    [form.classId]
  );

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-";
  }

  async function handleSubmit() {
    if (!form.name || !form.password || !form.classId || !form.gender || !form.mobile) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addDoc(collection(db, "students"), {
        ...form,
        classId: Number(form.classId),
        active: Boolean(form.active),
        selectedSubjects: form.selectedSubjects.map(Number),
      });
      toast.success("Student added successfully!");
      navigate("/admin/students");
    } catch (error) {
      toast.error("Error adding student: " + error.message);
    }
  }

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

  function toggleSubject(subjectId) {
    setForm((prev) => {
      const current = prev.selectedSubjects.map(Number);
      const next = current.includes(subjectId) ? current.filter((item) => item !== subjectId) : [...current, subjectId];
      return { ...prev, selectedSubjects: next };
    });
  }

  return (
    <div className="wrapper">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main">
                <Navbar title="Add Student" user={{ name: localStorage.getItem("user") || "User", role: (localStorage.getItem("role") || "").charAt(0).toUpperCase() + (localStorage.getItem("role") || "").slice(1) }} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Add Student</h2>
            <p>Create a student profile</p>
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
                  <img src={form.photo} alt="Student preview" />
                ) : (
                  <div className="photo-upload-placeholder">
                    Choose Photo
                  </div>
                )}
              </div>
              <span>Upload Photo</span>
            </label>

            <div className="student-top-fields">
              <input placeholder="Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              <input placeholder="Password" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
            </div>
          </div>

          <div className="student-form-bottom">
            <select value={form.classId} onChange={(e) => updateField("classId", e.target.value)}>
              <option value="">Select Class</option>
              {Classes.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
            <select value={form.gender} onChange={(e) => updateField("gender", e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="date" value={form.dob} onChange={(e) => updateField("dob", e.target.value)} />
            <input placeholder="Mobile" value={form.mobile} onChange={(e) => updateField("mobile", e.target.value)} />
            <input placeholder="Parent Name" value={form.parentName} onChange={(e) => updateField("parentName", e.target.value)} />
            <input placeholder="Parent Contact" value={form.parentContact} onChange={(e) => updateField("parentContact", e.target.value)} />
            <input placeholder="Admission Date" type="date" value={form.admissionDate} onChange={(e) => updateField("admissionDate", e.target.value)} />
            <textarea placeholder="Address" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
            <label className="checkbox-row">
              <input type="checkbox" checked={form.active} onChange={(e) => updateField("active", e.target.checked)} />
              Active
            </label>
          </div>

          {selectedClass && (
            <div className="subject-block">
              <h3>Subjects</h3>
              <div className="subject-columns">
                <div>
                  <h4>Compulsory</h4>
                  {selectedClass.compulsorySubjects.map((id) => (
                    <div key={id} className="subject-pill">{getSubjectName(id)}</div>
                  ))}
                </div>
                <div>
                  <h4>Optional</h4>
                  {selectedClass.optionalSubjects[0].subjects.map((id) => (
                    <label key={id} className="subject-checkbox">
                      <input
                        type="checkbox"
                        checked={form.selectedSubjects.map(Number).includes(id)}
                        onChange={() => toggleSubject(id)}
                      />
                      {getSubjectName(id)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button onClick={handleSubmit}>Save Student</button>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
