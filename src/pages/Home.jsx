import { Link } from "react-router-dom";
import { ArrowRight, BellRing, BriefcaseBusiness, CalendarDays, CheckCircle2, Sparkles } from "lucide-react";
import { useJobs } from "../context/JobContext";

export default function Home() {
  const { jobs } = useJobs();
  const interviews = jobs.filter((job) => job.status === "Interview").length;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = jobs.filter((job) => job.interviewDate && job.interviewDate >= today).length;
  let firstName = "there";
  try {
    firstName = JSON.parse(localStorage.getItem("jobTrackUser") || "null")?.name?.trim().split(/\s+/)[0] || "there";
  } catch {
    firstName = "there";
  }

  return (
    <main className="motivation-home">
      <section className="motivation-hero">
        <div className="motivation-glow motivation-glow-one" />
        <div className="motivation-glow motivation-glow-two" />
        <p className="motivation-backdrop" aria-hidden="true">REMEMBER WHY YOU STARTED</p>
        <div className="home-welcome-card">
          <div className="home-card-brand"><span><BriefcaseBusiness size={21} /></span><strong>JobTrack</strong></div>
          <div className="home-card-divider" />
          <span className="home-card-kicker"><Sparkles size={13} /> YOUR CAREER WORKSPACE</span>
          <h1>Keep going, <span>{firstName}.</span></h1>
          <p className="home-card-copy">Every application is progress. Your next opportunity is worth showing up for.</p>
          <div className="home-mini-stats">
            <div><BriefcaseBusiness size={16} /><span><strong>{jobs.length}</strong><small>Applications</small></span></div>
            <div><CalendarDays size={16} /><span><strong>{upcoming}</strong><small>Upcoming interviews</small></span></div>
            <div><CheckCircle2 size={16} /><span><strong>{interviews}</strong><small>Interview stages</small></span></div>
          </div>
          <Link className="home-dashboard-button" to="/dashboard">Open my dashboard <ArrowRight size={17} /></Link>
          <Link className="home-find-link" to="/find-jobs">Explore example roles</Link>
          <p className="home-card-note"><BellRing size={12} /> Your progress is saved in this browser.</p>
        </div>
        <div className="motivation-bottom-label"><span /> SMALL STEPS. REAL PROGRESS. <span /></div>
      </section>
      <section className="home-next-step">
        <div><p className="eyebrow">YOUR NEXT STEP</p><h2>Make today count.</h2><p>Update an application, prepare for an interview, or discover roles that match your goals.</p></div>
        <div className="home-next-actions"><Link to="/add-job">Add an application <ArrowRight size={15} /></Link><Link to="/calendar">Review interview planner <ArrowRight size={15} /></Link><Link to="/analytics">See your progress <ArrowRight size={15} /></Link></div>
      </section>
    </main>
  );
}
