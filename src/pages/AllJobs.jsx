
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Plus, LayoutGrid, List, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useJobs } from "../context/JobContext";
import JobCard from "../components/JobCard";
import SearchFilter from "../components/SearchFilter";

export default function AllJobs() {
  const { jobs, deleteJob } = useJobs();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("cards");

  useEffect(() => {
    setSearch(params.get("search") || "");
  }, [params]);

  const filteredJobs = useMemo(() => jobs.filter(job => {
    const text = `${job.company} ${job.role} ${job.location} ${job.type} ${job.source} ${job.notes}`.toLowerCase();
    return text.includes(search.toLowerCase()) &&
      (status === "All" || job.status === status);
  }).sort((a, b) => sort === "company"
    ? a.company.localeCompare(b.company)
    : (b.date || "").localeCompare(a.date || "")), [jobs, search, status, sort]);

  function confirmDelete(job) {
    if (window.confirm(`Delete the ${job.role} application at ${job.company}?`)) deleteJob(job.id);
  }

  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow">YOUR JOB PIPELINE</p><h1>My Applications</h1>
          <p className="muted">Manage and track every opportunity.</p></div>
        <Link to="/add-job" className="primary-button"><Plus size={17} /> New Application</Link>
      </section>

      <SearchFilter search={search} setSearch={setSearch}
        status={status} setStatus={setStatus} />

      <div className="application-toolbar">
        <p className="results-label">{filteredJobs.length} applications found</p>
        <label className="application-sort">Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Date applied</option><option value="company">Company name</option></select></label>
        <div className="view-switch" aria-label="Application view">
          <button className={view === "cards" ? "active" : ""} type="button" onClick={() => setView("cards")} aria-label="Card view"><LayoutGrid size={16} /></button>
          <button className={view === "list" ? "active" : ""} type="button" onClick={() => setView("list")} aria-label="List view"><List size={16} /></button>
        </div>
      </div>

      {view === "cards" ? <div className="job-grid">
        {filteredJobs.map(job =>
          <JobCard key={job.id} job={job} onDelete={deleteJob} />
        )}
      </div> : <div className="application-table-wrap panel"><table className="application-table"><thead><tr><th>Role / Company</th><th>Date applied</th><th>Status</th><th>Work mode</th><th>Salary</th><th>Actions</th></tr></thead><tbody>{filteredJobs.map(job => <tr key={job.id}><td><strong>{job.role}</strong><small>{job.company}</small></td><td>{job.date || "—"}</td><td><span className={`status-badge badge-${job.status.toLowerCase()}`}>{job.status}</span></td><td>{job.location || "—"}</td><td>{job.salary || "—"}</td><td className="table-actions"><Link to={`/jobs/${job.id}`} aria-label={`View ${job.role}`}><ExternalLink size={16} /></Link><Link to={`/jobs/${job.id}/edit`} aria-label={`Edit ${job.role}`}><Pencil size={16} /></Link><button type="button" onClick={() => confirmDelete(job)} aria-label={`Delete ${job.role}`}><Trash2 size={16} /></button></td></tr>)}</tbody></table></div>}

      {filteredJobs.length === 0 && (
        <div className="panel empty-state">
          <h3>No applications found</h3>
          <p>Try another search or add a new job.</p>
        </div>
      )}
    </>
  );
}
