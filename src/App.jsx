
import { useState } from "react";
import {
  BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams, Link
} from "react-router-dom";
import { JobProvider } from "./context/JobContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AllJobs from "./pages/AllJobs";
import AddJob from "./pages/AddJob";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { useJobs } from "./context/JobContext";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import FindJobs from "./pages/FindJobs";
import SavedJobs from "./pages/SavedJobs";
import Settings from "./pages/Settings";
import JobForm from "./components/JobForm";
import { Eye, Pencil, Trash2 } from "lucide-react";
import "./App.css";

function Kanban() {
  const { jobs, updateJob, deleteJob } = useJobs();
  const navigate = useNavigate();
  const statuses = ["Wishlist", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"];

  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow">VISUAL WORKFLOW</p><h1>Kanban Board</h1>
          <p className="muted">Update the status of your applications.</p></div>
      </section>

      <div className="kanban-board">
        {statuses.map(status => (
          <section className="kanban-column" key={status}>
            <h3>{status} <span>{jobs.filter(j => j.status === status).length}</span></h3>
            {jobs.filter(j => j.status === status).map(job => (
              <article className="kanban-card" key={job.id}>
                <div className="kanban-card-heading">
                  <strong>{job.role}</strong>
                  <span>{job.company}</span>
                </div>
                <div className="kanban-card-meta">
                  <span>{job.location || "Location not set"}</span>
                  <span>{job.date || "Not applied yet"}</span>
                </div>
                {job.interviewDate && <p className="kanban-interview-date">Interview · {job.interviewDate}{job.interviewTime ? ` at ${job.interviewTime}` : ""}</p>}
                <label className="kanban-status-label">Move to
                  <select value={job.status} onChange={e => updateJob(job.id, { status: e.target.value })}>
                    {statuses.map(s => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <div className="kanban-card-actions">
                  <button type="button" onClick={() => navigate(`/jobs/${job.id}`)} aria-label={`View ${job.role}`}><Eye size={14} /> Details</button>
                  <button type="button" onClick={() => navigate(`/jobs/${job.id}/edit`)} aria-label={`Edit ${job.role}`}><Pencil size={14} /> Edit</button>
                  <button type="button" className="kanban-delete" onClick={() => {
                    if (window.confirm(`Delete ${job.role} at ${job.company}?`)) deleteJob(job.id);
                  }} aria-label={`Delete ${job.role}`}><Trash2 size={14} /></button>
                </div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}

function JobDetails() {
  const { jobs, updateJob, deleteJob } = useJobs();
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(item => item.id === id);

  if (!job) {
    return <section className="panel"><h2>Application not found</h2><Link className="text-button" to="/jobs">Back to applications</Link></section>;
  }

  return (
    <section className="panel detail-page">
      <p className="eyebrow">APPLICATION DETAILS</p>
      <h1>{job.role}</h1>
      <h3>{job.company}</h3>
      <p className="muted">Applied on: {job.date}</p>
      <p>Work mode: {job.location}</p>
      <p>Job type: {job.type}</p>
      <p>Salary: {job.salary || "Not specified"}</p>
      <p>Notes: {job.notes || "No notes added"}</p>
      {job.contactPerson && <p>Contact: {job.contactPerson}</p>}
      {job.followUpDate && <p>Next follow-up: {job.followUpDate}</p>}
      {job.jobUrl?.startsWith("https://") && <p><a href={job.jobUrl} target="_blank" rel="noreferrer">Open job posting</a></p>}
      {job.applicationUrl?.startsWith("https://") && <p><a href={job.applicationUrl} target="_blank" rel="noreferrer">Open application page</a></p>}
      <label>Status
        <select value={job.status} onChange={e => updateJob(job.id, { status: e.target.value })}>
            {["Wishlist", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"].map(s =>
            <option key={s}>{s}</option>
          )}
        </select>
      </label>
      <Link className="primary-button" to={`/jobs/${job.id}/edit`}>Edit application</Link>
      <button className="danger-button" onClick={() => {
        if (window.confirm(`Delete ${job.role} at ${job.company}?`)) {
          deleteJob(job.id);
          navigate("/jobs");
        }
      }}>Delete application</button>
      <Link className="secondary-button" to="/jobs">Back to applications</Link>
    </section>
  );
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const authPage = ["/login", "/signup"].includes(location.pathname);
  const isAuthenticated = localStorage.getItem("jobTrackSession") === "active";
  const publicPage = ["/", "/login", "/signup"].includes(location.pathname);

  if (authPage && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!authPage && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (publicPage) {
    return (
      <div className="public-site">
        <Navbar />
        <main className={`public-page-content ${["/login", "/signup"].includes(location.pathname) ? "auth-content" : ""}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="main-area">
        <Navbar onMenuClick={() => setMenuOpen(true)} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<AllJobs />} />
            <Route path="/find-jobs" element={<FindJobs />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/jobs/:id/edit" element={<EditApplication />} />
            <Route path="/add-job" element={<AddJob />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function EditApplication() {
  const { id } = useParams();
  const { jobs } = useJobs();
  const job = jobs.find((item) => item.id === id);
  return job ? <div className="form-page"><p className="eyebrow">UPDATE YOUR PIPELINE</p><h1>Edit application</h1><JobForm initialJob={job} /></div> : <section className="panel"><h2>Application not found</h2><Link to="/jobs">Back to applications</Link></section>;
}

function UserDataBoundary() {
  const location = useLocation();
  let owner = "guest";
  try {
    owner = JSON.parse(localStorage.getItem("jobTrackUser") || "null")?.email?.trim().toLowerCase() || "guest";
  } catch {
    owner = "guest";
  }
  return <JobProvider key={owner}><Layout key={location.pathname === "/signup" || location.pathname === "/login" ? location.pathname : owner} /></JobProvider>;
}

export default function App() {
  return (
    <BrowserRouter>
      <UserDataBoundary />
    </BrowserRouter>
  );
}
