import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { UserRound } from "lucide-react";

import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Classes, Subjects } from "../../../data/data";
import { deleteTeacher, getTeacherById, updateTeacher } from "../../../api/teacherApi";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";

const emptyTeacher = {
  name: "",
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

function formatDateForInput(value) {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
}

function TeacherProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [form, setForm] = useState(emptyTeacher);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const navbarUser = getNavbarUser();
  const editing = searchParams.get("mode") === "edit";

  useEffect(() => {
    async function loadTeacher() {
      try {
        setLoading(true);

        const response = await getTeacherById(id);
        const teacherData = response.teacher;

        setTeacher(teacherData);

        setForm({
          ...emptyTeacher,
          ...teacherData,
          dob: formatDateForInput(teacherData.dob),
          joiningDate: formatDateForInput(teacherData.joiningDate),
          assignedClasses: Array.isArray(teacherData.assignedClasses) ? teacherData.assignedClasses.map(Number) : [],
          assignedSubjects: Array.isArray(teacherData.assignedSubjects) ? teacherData.assignedSubjects.map(Number) : [],
        });
      } catch (error) {
        toast.error("Error loading teacher: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    loadTeacher();
  }, [id]);

  function getClassName(classId) {
    return Classes.find((item) => item.id === Number(classId))?.name || "-";
  }

  function getSubjectName(subjectId) {
    return Subjects.find((item) => item.id === Number(subjectId))?.name || "-";
  }

  function updateField(name, value) {
    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function toggleClass(classId) {
    setForm((previousForm) => {
      const current = previousForm.assignedClasses.map(Number);

      return {
        ...previousForm,
        assignedClasses: current.includes(classId) ? current.filter((item) => item !== classId) : [...current, classId],
      };
    });
  }

  function toggleSubject(subjectId) {
    setForm((previousForm) => {
      const current = previousForm.assignedSubjects.map(Number);

      return {
        ...previousForm,
        assignedSubjects: current.includes(subjectId) ? current.filter((item) => item !== subjectId) : [...current, subjectId],
      };
    });
  }

  async function handleSave() {
    if (!form.name) {
      toast.error("Name is required");
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

      const response = await updateTeacher(id, {
        name: form.name,
        gender: form.gender || null,
        dob: form.dob || null,
        mobile: form.mobile,
        email: form.email,
        address: form.address,
        joiningDate: form.joiningDate || null,
        assignedClasses: form.assignedClasses.map(Number),
        assignedSubjects: form.assignedSubjects.map(Number),
        active: form.active,
      });

      setTeacher(response.teacher);
      toast.success("Teacher updated successfully!");
      navigate(`/admin/teachers/${id}`);
    } catch (error) {
      toast.error("Error updating teacher: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this teacher?")) {
      return;
    }

    try {
      await deleteTeacher(id);
      toast.success("Teacher deleted successfully!");
      navigate("/admin/teachers");
    } catch (error) {
      toast.error("Error deleting teacher: " + error.message);
    }
  }

  const photoUrl = teacher?.photo?.url || "";

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="Teacher Profile" user={navbarUser} onToggleSidebar={() => setSidebarOpen((previous) => !previous)} />

        {loading ? (
          <div className="panel">Loading teacher profile...</div>
        ) : !teacher ? (
          <div className="panel">Teacher not found</div>
        ) : !editing ? (
          <>
            <div className="page-header">
              <div>
                <h2>Teacher Profile</h2>
                <p>{teacher.name}</p>
              </div>

              <div>
                <button onClick={() => navigate(`/admin/teachers/${id}?mode=edit`)}>
                  Edit
                </button>

                <button onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>

            <div className="profile-card">
              {photoUrl ? (
                <img className="profile-photo" src={photoUrl} alt={teacher.name} />
              ) : (
                <div className="profile-photo placeholder-photo">
                  <UserRound size={38} />
                </div>
              )}

              <div className="profile-details">
                <div>
                  <strong>Teacher ID:</strong> {teacher.teacherId || "-"}
                </div>

                <div>
                  <strong>Name:</strong> {teacher.name || "-"}
                </div>

                <div>
                  <strong>Gender:</strong> {teacher.gender || "-"}
                </div>

                <div>
                  <strong>DOB:</strong> {formatDateForInput(teacher.dob) || "-"}
                </div>

                <div>
                  <strong>Mobile:</strong> {teacher.mobile || "-"}
                </div>

                <div>
                  <strong>Email:</strong> {teacher.email || "-"}
                </div>

                <div>
                  <strong>Classes:</strong> {(teacher.assignedClasses || []).map(getClassName).join(", ") || "-"}
                </div>

                <div>
                  <strong>Subjects:</strong> {(teacher.assignedSubjects || []).map(getSubjectName).join(", ") || "-"}
                </div>

                <div>
                  <strong>Joining Date:</strong> {formatDateForInput(teacher.joiningDate) || "-"}
                </div>

                <div>
                  <strong>Active:</strong> {teacher.active === false ? "No" : "Yes"}
                </div>

                <div>
                  <strong>Address:</strong> {teacher.address || "-"}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="page-header">
              <div>
                <h2>Edit Teacher Profile</h2>
                <p>Update teacher details and assignments</p>
              </div>
            </div>

            <div className="form-card">
              <div className="student-form-bottom">
                <input placeholder="Name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />

                <select value={form.gender || ""} onChange={(event) => updateField("gender", event.target.value)}>
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

              <div className="subject-block">
                <h3>Assigned Subjects</h3>

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

              <button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TeacherProfile;
