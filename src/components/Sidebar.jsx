
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, BriefcaseBusiness, Columns3, Search, Bookmark,
  CalendarDays, ChartNoAxesCombined, Settings, UserRound, Mail, X
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/find-jobs", label: "Find Jobs", icon: Search },
  { to: "/jobs", label: "My Applications", icon: BriefcaseBusiness },
  { to: "/saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { to: "/kanban", label: "Kanban Board", icon: Columns3 },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/contact", label: "Help Center", icon: Mail },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function Sidebar({ open, onClose }) {
  const user = JSON.parse(localStorage.getItem("jobTrackUser") || "null");
  const displayName = user?.name || user?.email?.split("@")[0] || "Job Seeker";

  return (
    <>
      {open && <button className="sidebar-overlay" onClick={onClose} aria-label="Close menu" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><BriefcaseBusiness /></div>
          <span>Job<span className="brand-accent">Track</span></span>
          <button className="mobile-close" onClick={onClose}><X /></button>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item ${isActive ? "nav-active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <p className="nav-heading">YOUR WORKSPACE</p>
          <div className="profile">
            <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{displayName}</strong>
              <span>{user?.email || "Career dashboard"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
