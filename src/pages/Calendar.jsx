
import { CalendarDays, Clock } from "lucide-react";
import { useJobs } from "../context/JobContext";

export default function Calendar() {
  const { jobs } = useJobs();

  const interviews = jobs
    .filter(job => job.interviewDate && job.status === "Interview")
    .sort((a, b) => a.interviewDate.localeCompare(b.interviewDate));
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = interviews.filter((job) => job.interviewDate >= today);
  const past = interviews.filter((job) => job.interviewDate < today);

  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow">PLAN YOUR NEXT STEP</p><h1>Interview Calendar</h1>
          <p className="muted">Keep track of interview dates and reminders.</p></div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div><h2>Interview Planner</h2><p>{upcoming.length} upcoming · {past.length} past interviews</p></div>
          <CalendarDays size={22} />
        </div>

        {interviews.length === 0 ? (
          <p className="muted">No interview dates added yet. Add an interview date to a job application.</p>
        ) : [...upcoming, ...past].map(job => (
          <article className="calendar-item" key={job.id}>
            <div className="calendar-date"><CalendarDays size={20} /></div>
            <div className="calendar-details">
              <strong>{job.company} — {job.role}</strong>
                <span><Clock size={14} /> {job.interviewDate}{job.interviewTime ? ` · ${job.interviewTime}` : ""}{job.interviewRound ? ` · ${job.interviewRound}` : ""}</span>
                <span>{job.interviewFormat || "Online"}{job.preparationNotes ? ` · ${job.preparationNotes}` : ""}</span>
                {job.meetingLink?.startsWith("https://") && job.interviewDate >= today && <a href={job.meetingLink} target="_blank" rel="noreferrer">Open meeting link</a>}
            </div>
            <span className={`status-badge badge-${job.status.toLowerCase()}`}>{job.status}</span>
          </article>
        ))}
        {interviews.length > 0 && <p className="interview-planner-note">Interview reminders are shown in this browser only. Email and push notifications are not configured.</p>}
      </section>
    </>
  );
}
