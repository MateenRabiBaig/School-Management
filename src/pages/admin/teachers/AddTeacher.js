import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Classes, Subjects } from "../../../data/data";
import { createTeacher } from "../../../api/teacherApi";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";
import ImageUpload from "../../../components/ImageUpload";

const initialForm = {
  name: "",
  password: "",
  gender: "",
  dob: "",
  mobile: "",
  email: "",
  address: "",
  joiningDate: "",
  assignedClasses: [],
  assignedSubjects: [],
  active: true,
};

function AddTeacher() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [photo, setPhoto] = useState({ url: "", publicId: "" })
  const navigate = useNavigate();
  const navbarUser = getNavbarUser();

  function updateField(name, value) {
    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function toggleClass(classId) {
    setForm((previousForm) => {
      const currentClasses = previousForm.assignedClasses.map(Number);
      const assignedClasses = currentClasses.includes(classId) ? currentClasses.filter((id) => id !== classId) : [...currentClasses, classId];

      return { ...previousForm, assignedClasses };
    });
  }

  function toggleSubject(subjectId) {
    setForm((previousForm) => {
      const currentSubjects = previousForm.assignedSubjects.map(Number);
      const assignedSubjects = currentSubjects.includes(subjectId) ? currentSubjects.filter((id) => id !== subjectId) : [...currentSubjects, subjectId];

      return { ...previousForm, assignedSubjects };
    });
  }

  async function handleSubmit() {
    if (!form.name || !form.password) {
      toast.error("Name and password are required");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }

    if (form.assignedClasses.length === 0) {
      toast.error("Please assign at least one class");
      return;
    }

    if (form.assignedSubjects.length === 0) {
      toast.error("Please assign at least one subject");
      return;
    }

    try {
      setSaving(true);

      await createTeacher({
        ...form,
        assignedClasses: form.assignedClasses.map(Number),
        assignedSubjects: form.assignedSubjects.map(Number),
      });
      toast.success("Teacher added successfully!");
      navigate("/admin/teachers");
    }
    catch (error) {
      toast.error("Error adding teacher: " + error.message);
    }
    finally {
      setSaving(false);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="Add Teacher" user={navbarUser} onToggleSidebar={() => setSidebarOpen((previous) => !previous)} />

        <div className="page-header">
          <div>
            <h2>Add Teacher</h2>
            <p>Create a teacher profile</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-top">
            <div className="student-top-fields">
              <ImageUpload value={photo} onChange={setPhoto} label="Teacher Photo" />
              <input placeholder="Name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
              <input type="password" placeholder="Password" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
            </div>
          </div>

          <div className="student-form-bottom">
            <select value={form.gender} onChange={(event) => updateField("gender", event.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input type="date" value={form.dob} onChange={(event) => updateField("dob", event.target.value)} />
            <input placeholder="Mobile" value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} />
            <input type="email" placeholder="Email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
            <input type="date" value={form.joiningDate} onChange={(event) => updateField("joiningDate", event.target.value)} />
            <textarea placeholder="Address" value={form.address} onChange={(event) => updateField("address", event.target.value)} />

            <label className="checkbox-row">
              <input type="checkbox" checked={form.active} onChange={(event) => updateField("active", event.target.checked)} />
              Active
            </label>
          </div>

          <div className="subject-block">
            <h3>Assigned Classes</h3>

            <div className="subject-columns">
              <div>
                {Classes.map((classItem) => (
                  <label key={classItem.id} className="subject-checkbox">
                    <input
                      type="checkbox"
                      checked={form.assignedClasses.includes(classItem.id)}
                      onChange={() => toggleClass(classItem.id)}
                    />
                    {classItem.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="subject-block">
            <h3>Assigned Subjects</h3>

            <div className="subject-columns">
              <div>
                {Subjects.map((subject) => (
                  <label key={subject.id} className="subject-checkbox">
                    <input
                      type="checkbox"
                      checked={form.assignedSubjects.includes(subject.id)}
                      onChange={() => toggleSubject(subject.id)}
                    />
                    {subject.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Teacher"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTeacher;