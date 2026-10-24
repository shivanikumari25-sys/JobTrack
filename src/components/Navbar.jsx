import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, BriefcaseBusiness, ChevronDown, Menu, X } from "lucide-react";

const pageTitles = {
  "/dashboard": "Dashboard", "/find-jobs": "Find Jobs", "/jobs": "My Applications",
  "/saved-jobs": "Saved Jobs", "/kanban": "Application Board", "/calendar": "Interview Planner",
  "/analytics": "Analytics", "/profile": "My Profile", "/settings": "Settings", "/contact": "Help Center"
};

export default function Navbar({ onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authenticatedLayout = Boolean(onMenuClick);
  const title = pageTitles[location.pathname] || (location.pathname.startsWith("/jobs/") ? "Application details" : "JobTrack");
  let user = null;
  try { user = JSON.parse(localStorage.getItem("jobTrackUser") || "null"); } catch { user = null; }
  const active = localStorage.getItem("jobTrackSession") === "active";
  const displayName = user?.name || user?.email?.split("@")[0] || "Job Seeker";

  function logout() {
    localStorage.removeItem("jobTrackSession");
    navigate("/login");
  }

  if (authenticatedLayout) {
    return (
      <header className="workspace-header">
        <button className="workspace-menu-toggle" type="button" onClick={onMenuClick} aria-label="Open workspace navigation"><Menu size={20} /></button>
        <div className="workspace-page-title"><span>{title}</span><small>JobTrack workspace</small></div>
        <div className="workspace-header-actions">
          <Link className="back-home-link" to="/"><ArrowLeft size={15} /><span>Back to homepage</span></Link>
          <div className="notification-wrap">
            <button className={`workspace-icon-button ${notificationsOpen ? "is-active" : ""}`} type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}><Bell size={18} /><span className="notification-indicator" /></button>
            {notificationsOpen && <div className="notification-popover" role="status"><strong>You’re all caught up</strong><span>Interview reminders will appear here when you add interview dates.</span><Link to="/calendar" onClick={() => setNotificationsOpen(false)}>Open interview planner</Link></div>}
          </div>
          <Link className="workspace-user-chip" to="/profile"><span className="workspace-avatar">{displayName.charAt(0).toUpperCase()}</span><span className="workspace-user-copy"><strong>{displayName}</strong><small>{user?.email || "Your profile"}</small></span><ChevronDown size={15} /></Link>
          <button className="workspace-logout" type="button" onClick={logout}>Logout</button>
        </div>
      </header>
    );
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="navbar-logo"><BriefcaseBusiness size={18} /> JobTrack</Link>
        <button type="button" className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {active ? <><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink><NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink><NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink><button type="button" className="navbar-button" onClick={logout}>Logout</button></> : <><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink><NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink><Link className="public-signup-link" to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link></>}
        </div>
      </nav>
    </header>
  );
}
