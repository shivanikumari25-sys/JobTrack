import { useMemo, useState } from "react";
import { useJobs } from "../context/JobContext";
import { ArrowRight, Bookmark, BriefcaseBusiness, MapPin, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Illustrative entries only; there is no live job feed or employer verification.
const examples = [
  { id: "ex-frontend", company: "Sample Studio", role: "Junior Frontend Developer", location: "Remote · India", workMode: "Remote", type: "Full-time", skills: ["React", "JavaScript", "CSS"], description: "Example listing for trying search and save features. Check employers' official career sites for real vacancies." },
  { id: "ex-intern", company: "Example Labs", role: "Web Development Intern", location: "Bengaluru, India", workMode: "Hybrid", type: "Internship", skills: ["HTML", "CSS", "Git"], description: "Illustrative internship only. No application page or live vacancy is connected." },
  { id: "ex-qa", company: "Demo Works", role: "Graduate QA Engineer", location: "Pune, India", workMode: "On-site", type: "Full-time", skills: ["Testing", "SQL", "Communication"], description: "Sample role to demonstrate the JobTrack application workflow." },
  { id: "ex-data", company: "Practice Systems", role: "Data Analyst Trainee", location: "Remote · India", workMode: "Remote", type: "Internship", skills: ["Excel", "SQL", "Python"], description: "Fictional listing. Use verified sources to find actual opportunities." },
];

export default function FindJobs() {
  const { savedJobs, saveJob, unsaveJob, addJob } = useJobs();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [mode, setMode] = useState("All work modes");
  const navigate = useNavigate();
  const results = useMemo(() => examples.filter((job) => `${job.role} ${job.company} ${job.location} ${job.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()) && (type === "All types" || job.type === type) && (mode === "All work modes" || job.workMode === mode)), [query, type, mode]);

  function track(job) {
    addJob({ company: job.company, role: job.role, date: "", status: "Wishlist", type: job.type, location: job.workMode, salary: "", notes: job.description, source: "JobTrack sample listing", interviewDate: "" });
    unsaveJob(job.id);
    navigate("/jobs");
  }

  return <div className="discover-page">
    <section className="discover-hero"><div><p className="eyebrow">CAREER EXPLORER</p><h1>Find your next opportunity</h1><p>Search example roles, save ideas, and add a role to your application tracker.</p></div><BriefcaseBusiness size={30} /></section>
    <div className="sample-disclaimer"><Sparkles size={16} /><span><strong>Illustrative sample listings</strong> — not current vacancies or verified employers. A live job-feed API is not connected.</span></div>
    <div className="discover-controls panel"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, company, skill, or location" aria-label="Search jobs" /></label><select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter by job type"><option>All types</option><option>Full-time</option><option>Internship</option><option>Part-time</option><option>Contract</option></select><select value={mode} onChange={(event) => setMode(event.target.value)} aria-label="Filter by work mode"><option>All work modes</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></div>
    <p className="results-label">{results.length} example {results.length === 1 ? "role" : "roles"}</p>
    {results.length ? <div className="discover-grid">{results.map((job) => {
      const saved = savedJobs.some((item) => item.id === job.id);
      return <article className="discover-card" key={job.id}><div className="discover-card-heading"><span className="company-mark">{job.company.charAt(0)}</span><span className="example-tag">EXAMPLE</span></div><p className="company-name">{job.company}</p><h2>{job.role}</h2><div className="discover-meta"><span><MapPin size={14} />{job.location}</span><span><BriefcaseBusiness size={14} />{job.type} · {job.workMode}</span></div><div className="skill-pills">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><p className="discover-description">{job.description}</p><div className="discover-card-actions"><button className="primary-button" type="button" onClick={() => track(job)}>Add to tracker <ArrowRight size={14} /></button><button className={`bookmark-button ${saved ? "saved" : ""}`} type="button" onClick={() => saved ? unsaveJob(job.id) : saveJob(job)} aria-label={saved ? `Unsave ${job.role}` : `Save ${job.role}`}><Bookmark size={16} fill={saved ? "currentColor" : "none"} />{saved ? "Saved" : "Save"}</button></div></article>;
    })}</div> : <section className="panel empty-state"><h2>No example roles found</h2><p>Try a different title, skill, or location.</p></section>}
  </div>;
}
