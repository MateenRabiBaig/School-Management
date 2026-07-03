import { Menu, Search, Bell } from "lucide-react";

function Navbar({ title, user, onToggleSidebar }) {
    let profile;
    if(user?.photo) {
        profile = (
            <img src={user.photo} alt={user?.name} />
        )
    }
    else {
        profile = (
            <img src="https://api.dicebear.com/10.x/thumbs/svg?seed=gv9jab1p" alt="avatar" />
        )
    }

    return (
        <header className="navbar">

            <div className="navbar-left">
                <button className="menu-btn" type="button" onClick={onToggleSidebar || (() => {})} aria-label="Toggle sidebar">
                    <Menu size={22} />
                    <h2 className="navbar-title">{title}</h2>
                </button>
            </div>

            <div className="navbar-center">
                <div className="search-box">
                    <Search size={22} />
                    <input
                        type="text"
                        placeholder="Search..."
                    />
                </div>
            </div>

            <div className="navbar-right">
                <button className="notification" type="button" aria-label="Notifications">
                    <Bell size={22} />
                    <span>3</span>
                </button>

                <div className="profile">
                    {profile}
                    <div>
                        <h4>{user?.name}</h4>
                        <p>{user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar;
