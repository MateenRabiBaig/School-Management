import { useEffect, useState } from "react";

import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import {
  activateAcademicYear,
  createAcademicYear,
  deleteAcademicYear,
  getAcademicYears,
  updateAcademicYear,
} from "../../../api/academicYearApi";
import getNavbarUser from "../../../utils/getNavbarUser";
import { toast } from "react-toastify";

function AcademicYears() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [academicYears, setAcademicYears] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    active: false,
  });

  const navbarUser = getNavbarUser();

  useEffect(() => {
    async function loadAcademicYears() {
      try {
        const response = await getAcademicYears();
        setAcademicYears(response.academicYears || []);
      } catch (error) {
        toast.error("Error loading academic years: " + error.message);
      }
    }

    loadAcademicYears();
  }, []);

  function startEdit(academicYear) {
    setEditingId(academicYear.id);
    setForm({
      name: academicYear.name || "",
      startDate: academicYear.startDate ? String(academicYear.startDate).slice(0, 10) : "",
      endDate: academicYear.endDate ? String(academicYear.endDate).slice(0, 10) : "",
      active: academicYear.active || false,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      name: "",
      startDate: "",
      endDate: "",
      active: false,
    });
  }

  async function handleSave() {
    if (!form.name || !form.startDate || !form.endDate) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateAcademicYear(editingId, form);
        toast.success("Academic year updated successfully");
      } else {
        await createAcademicYear(form);
        toast.success("Academic year created successfully");
      }

      const response = await getAcademicYears();
      setAcademicYears(response.academicYears || []);
      resetForm();
    } catch (error) {
      toast.error("Error saving academic year: " + error.message);
    }
  }

  async function handleActivate(id) {
    try {
      await activateAcademicYear(id);
      toast.success("Academic year activated successfully");

      const response = await getAcademicYears();
      setAcademicYears(response.academicYears || []);
    } catch (error) {
      toast.error("Error activating academic year: " + error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this academic year?")) {
      return;
    }

    try {
      await deleteAcademicYear(id);
      toast.success("Academic year deleted successfully");

      setAcademicYears((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      toast.error("Error deleting academic year: " + error.message);
    }
  }

  return (
    <div className="wrapper">
      <Sidebar isOpen={sidebarOpen} />

      <div className="main">
        <Navbar title="Academic Years" user={navbarUser} onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <div className="page-header">
          <div>
            <h2>Academic Years</h2>
            <p>Manage the active academic year for the school</p>
          </div>
        </div>

        <div className="form-card">
          <div className="student-form-bottom">
            <input
              placeholder="Academic Year Name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />

            <input
              type="date"
              value={form.startDate}
              onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
            />

            <input
              type="date"
              value={form.endDate}
              onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
            />
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm((prev) => ({ ...prev, active: event.target.checked }))}
            />
            Active
          </label>

          <button onClick={handleSave}>
            {editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {academicYears.map((academicYear) => (
                <tr key={academicYear.id}>
                  <td>{academicYear.name}</td>
                  <td>{academicYear.startDate ? String(academicYear.startDate).slice(0, 10) : "-"}</td>
                  <td>{academicYear.endDate ? String(academicYear.endDate).slice(0, 10) : "-"}</td>
                  <td>{academicYear.active ? "Active" : "Inactive"}</td>
                  <td>
                    {!academicYear.active && (
                      <button onClick={() => handleActivate(academicYear.id)}>
                        Activate
                      </button>
                    )}

                    <button onClick={() => startEdit(academicYear)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(academicYear.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AcademicYears;
