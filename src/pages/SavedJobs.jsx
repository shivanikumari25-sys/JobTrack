import { useMemo, useState } from "react";
import { Bookmark, MapPin, BriefcaseBusiness, ArrowRight, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobContext";

export default function SavedJobs() {
  const { savedJobs, unsaveJob, moveSavedToApplications } = useJobs();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const results = useMemo(() => savedJobs.filter((job) => `${job.company} ${job.role} ${job.location} ${(job.skills || []).join(" ")}`.toLowerCase().includes(query.toLowerCase())), [savedJobs, query]);
  return <div className="saved-page"><section className="welcome-row"><div><p className="eyebrow">YOUR SHORTLIST</p><h1>Saved Jobs</h1><p className="muted">Keep interesting roles together and move them into your tracker when ready.</p></div><span className="saved-total"><Bookmark size={15} /> {savedJobs.length} saved</span></section>
    <p className="sample-disclaimer"><Bookmark size={15} /> Saved listings are examples only; they are not live vacancies.</p>
    {savedJobs.length > 0 && <label className="saved-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search saved roles" aria-label="Search saved roles" /></label>}
    {results.length ? <div className="discover-grid">{results.map((job) => <article className="discover-card" key={job.id}><div className="discover-card-heading"><span className="company-mark">{job.company?.[0] || "J"}</span><span className="example-tag">EXAMPLE</span></div><p className="company-name">{job.company}</p><h2>{job.role}</h2><div className="discover-meta"><span><MapPin size={14} />{job.location}</span><span><BriefcaseBusiness size={14} />{job.type} · {job.workMode}</span></div><div className="skill-pills">{(job.skills || []).map((skill) => <span key={skill}>{skill}</span>)}</div><p className="discover-description">{job.description}</p><div className="discover-card-actions"><button className="primary-button" type="button" onClick={() => { moveSavedToApplications(job); navigate("/jobs"); }}>Move to applications <ArrowRight size={14} /></button><button className="bookmark-button" type="button" onClick={() => unsaveJob(job.id)}><Trash2 size={15} /> Remove</button></div></article>)}</div> : <section className="panel empty-state"><div className="empty-bookmark"><Bookmark size={22} /></div><h2>{savedJobs.length ? "No saved roles match" : "No saved jobs yet"}</h2><p>{savedJobs.length ? "Try another search." : "Save example roles from Find Jobs and they will appear here."}</p><button className="primary-button" type="button" onClick={() => navigate("/find-jobs")}>Browse example roles</button></section>}
  </div>;
}
