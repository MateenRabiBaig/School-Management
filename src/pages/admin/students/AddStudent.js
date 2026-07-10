import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Classes, Subjects } from "../../../data/data";
import { createStudent } from "../../../api/studentApi";
import getNavbarUser from "../../../utils/getNavbarUser";
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
};

function AddStudent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const navbarUser = getNavbarUser();
  const selectedClass = useMemo(() => Classes.find((item) => item.id === Number(form.classId)), [form.classId]);

  function getSubjectName(id) {
    return Subjects.find((item) => item.id === Number(id))?.name || "-";
  }

  function updateField(name, value) {
    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function selectOptionalSubject(groupSubjects, subjectId) {
    setForm((previousForm) => {
      const currentSubjects = previousForm.selectedSubjects.map(Number);
      const withoutCurrentGroup = currentSubjects.filter((id) => !groupSubjects.includes(id));

      return {
        ...previousForm,
        selectedSubjects: [...withoutCurrentGroup, subjectId],
      };
    });
  }

  function handleClassChange(classId) {
    setForm((previousForm) => ({
      ...previousForm,
      classId,
      selectedSubjects: [],
    }));
  }

  async function handleSubmit() {
    if (!form.name || !form.password || !form.classId || !form.gender || !form.mobile) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }

    try {
      setSaving(true);

      await createStudent({
        ...form,
        classId: Number(form.classId),
        selectedSubjects: form.selectedSubjects.map(Number),
      });

      toast.success("Student added successfully!");
      navigate("/admin/students");
    }
    catch (error) {
      toast.error("Error adding student: " + error.message);
    }
    finally {
      setSaving(false);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="Add Student" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Add Student</h2>
            <p>Create a student profile</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-top">
            <div className="student-top-fields">
              <input placeholder="Name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
              <input type="password" placeholder="Password" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
            </div>
          </div>

          <div className="student-form-bottom">
            <select value={form.classId} onChange={(event) => handleClassChange(event.target.value)}>
              <option value="">Select Class</option>
              {Classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select value={form.gender} onChange={(event) => updateField("gender", event.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input type="date" value={form.dob} onChange={(event) => updateField("dob", event.target.value)} />
            <input placeholder="Mobile" value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} />
            <input placeholder="Parent Name" value={form.parentName} onChange={(event) => updateField("parentName", event.target.value)} />
            <input placeholder="Parent Contact" value={form.parentContact} onChange={(event) => updateField("parentContact", event.target.value)} />
            <input type="date" value={form.admissionDate} onChange={(event) => updateField("admissionDate", event.target.value)} />
            <textarea placeholder="Address" value={form.address} onChange={(event) => updateField("address", event.target.value)} />

            <label className="checkbox-row">
              <input type="checkbox" checked={form.active} onChange={(event) => updateField("active", event.target.checked)} />
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
                    <div key={id} className="subject-pill">
                      {getSubjectName(id)}
                    </div>
                  ))}
                </div>
                <div>
                  <h4>Optional</h4>

                  {selectedClass.optionalSubjects.map((group) => (
                    <div key={group.groupName}>
                      <p>{group.groupName}</p>

                      {group.subjects.map((id) => (
                        <label key={id} className="subject-checkbox">
                          <input
                            type="radio"
                            name={`optional-${group.groupName}`}
                            checked={form.selectedSubjects.includes(id)}
                            onChange={() => selectOptionalSubject(group.subjects, id)}
                          />

                          {getSubjectName(id)}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;