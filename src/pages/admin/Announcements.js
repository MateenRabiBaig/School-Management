import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Search, X, Megaphone } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "../../api/announcementApi";
import getNavbarUser from "../../utils/getNavbarUser";

function AdminAnnouncements() {
  const navbarUser = getNavbarUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const emptyForm = { title: "", description: "", audience: "All", active: true };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      setLoading(true);
      const response = await getAnnouncements();
      setAnnouncements(response.announcements || []);
    }
    catch (error) {
      toast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      if (editingId) {
        await updateAnnouncement(editingId, form);
        toast.success("Announcement updated.");
      }
      else {
        await createAnnouncement(form);
        toast.success("Announcement created.");
      }
      setEditingId(null);
      setForm(emptyForm);
      loadAnnouncements();
    }

    catch (error) {
      toast.error(error.message);
    }
  }

  function editAnnouncement(item) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      audience: item.audience,
      active: item.active
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeAnnouncement(id) {

    if (!window.confirm("Delete this announcement?")) {
      return;
    }

    try {
      await deleteAnnouncement(id);
      toast.success("Announcement deleted.");
      loadAnnouncements();
    }
    catch (error) {
      toast.error(error.message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  const filteredAnnouncements = useMemo(() => {

    const keyword = search.toLowerCase();

    return announcements.filter(item =>

      item.title
        .toLowerCase()
        .includes(keyword)

      ||

      item.description
        .toLowerCase()
        .includes(keyword)

    );

  }, [

    announcements,

    search

  ]);
    return (

    <div className="wrapper">

      <Sidebar isOpen={sidebarOpen} />

      <div className="main">

        <Navbar
          title="Announcements"
          user={navbarUser}
          onToggleSidebar={() =>
            setSidebarOpen(
              prev => !prev
            )
          }
        />

        <div className="page-header">

          <div>

            <h2>

              Announcements

            </h2>

            <p>

              Create and manage school announcements.

            </p>

          </div>

        </div>

        <div className="panel">

          <form
            onSubmit={handleSubmit}
            className="form-grid"
          >

            <div className="form-group">

              <label>

                Title

              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Announcement title"
              />

            </div>

            <div className="form-group">

              <label>

                Audience

              </label>

              <select
                name="audience"
                value={form.audience}
                onChange={handleChange}
              >

                <option value="All">

                  All

                </option>

                <option value="Students">

                  Students

                </option>

                <option value="Teachers">

                  Teachers

                </option>

              </select>

            </div>

            <div
              className="form-group"
              style={{
                gridColumn:
                  "1 / -1"
              }}
            >

              <label>

                Description

              </label>

              <textarea
                rows={5}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Announcement description"
              />

            </div>

            <label
              className="checkbox"
            >

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />

              Active

            </label>

            <div
              style={{
                display: "flex",
                gap: 12
              }}
            >

              <button
                className="btn btn-primary"
                type="submit"
              >

                <Plus size={18} />

                {editingId
                  ? "Update"
                  : "Create"}

              </button>

              {editingId && (

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={
                    cancelEdit
                  }
                >

                  <X size={18} />

                  Cancel

                </button>

              )}

            </div>

          </form>

        </div>
                <div className="panel">

          <div className="table-toolbar">

            <div className="search-box">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

          </div>

          {loading ? (

            <div className="empty-state">

              <p>Loading announcements...</p>

            </div>

          ) : filteredAnnouncements.length === 0 ? (

            <div className="empty-state">

              <Megaphone size={55} />

              <h3>No Announcements</h3>

              <p>Create your first announcement.</p>

            </div>

          ) : (

            <div className="announcement-list">

              {filteredAnnouncements.map((item) => (

                <div
                  key={item.id}
                  className="announcement-card"
                >

                  <div className="announcement-top">

                    <div>

                      <h3>{item.title}</h3>

                      <p className="announcement-date">

                        {new Date(
                          item.createdAt
                        ).toLocaleDateString()}

                      </p>

                    </div>

                    <div
                      className="announcement-actions"
                    >

                      <button
                        className="btn-icon"
                        onClick={() =>
                          editAnnouncement(item)
                        }
                      >

                        <Pencil size={18} />

                      </button>

                      <button
                        className="btn-icon delete"
                        onClick={() =>
                          removeAnnouncement(
                            item.id
                          )
                        }
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </div>

                  <p className="announcement-description">

                    {item.description}

                  </p>

                  <div className="announcement-footer">

                    <span
                      className={`badge audience ${item.audience.toLowerCase()}`}
                    >

                      {item.audience}

                    </span>

                    <span
                      className={`badge ${
                        item.active
                          ? "active"
                          : "inactive"
                      }`}
                    >

                      {item.active
                        ? "Active"
                        : "Inactive"}

                    </span>

                    <span className="badge role">

                      {item.postedByRole}

                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default AdminAnnouncements;