
import {
  BriefcaseBusiness, CalendarDays, Handshake, CircleX
} from "lucide-react";
import { Link } from "react-router-dom";
import { useJobs } from "../context/JobContext";
import StatCard from "../components/StatCard";
import JobCard from "../components/JobCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const chartColors = ["#166534", "#22a06b", "#d69e2e", "#4776d0", "#7c5ac7", "#db6262", "#8491a5"];

export default function Dashboard() {
  const { jobs, deleteJob } = useJobs();
  let firstName = "there";
  try {
    firstName = JSON.parse(localStorage.getItem("jobTrackUser") || "null")?.name?.split(" ")[0] || "there";
  } catch {
    firstName = "there";
  }

  const count = (status) => jobs.filter(j => j.status === status).length;

  const stats = [
    { title: "Total Applications", value: jobs.length, icon: BriefcaseBusiness, tone: "blue", note: "All tracked opportunities" },
    { title: "Applied", value: count("Applied"), icon: BriefcaseBusiness, tone: "green", note: "Applications sent" },
    { title: "Assessments", value: count("Assessment"), icon: CalendarDays, tone: "orange", note: "Tasks to complete" },
    { title: "Interviews", value: count("Interview"), icon: CalendarDays, tone: "purple", note: "Keep preparing" },
    { title: "Offers Received", value: count("Offer"), icon: Handshake, tone: "green", note: "Congratulations!" },
    { title: "Rejected", value: count("Rejected"), icon: CircleX, tone: "orange", note: "Keep moving forward" }
  ];
  const statuses = ["Wishlist", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"];
  const statusData = statuses.map((status) => ({ name: status, value: count(status) }));
  const monthlyActivity = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return { name: date.toLocaleDateString(undefined, { month: "short" }), applications: jobs.filter((job) => job.date?.startsWith(key)).length };
  });
  const today = new Date().toISOString().slice(0, 10);
  const upcomingInterviews = jobs.filter((job) => job.interviewDate && job.interviewDate >= today).sort((a, b) => a.interviewDate.localeCompare(b.interviewDate)).slice(0, 4);

  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">YOUR CAREER WORKSPACE</p>
          <h1>Welcome back, {firstName}</h1>
          <p className="muted">Track your applications and move closer to your next opportunity.</p>
        </div>
        <div className="dashboard-quick-actions"><Link to="/find-jobs" className="secondary-button">Find Jobs</Link><Link to="/add-job" className="primary-button">+ Add Application</Link></div>
      </section>

      <section className="stats-grid dashboard-stats-grid">
        {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </section>

      <section className="dashboard-insights-grid">
        <div className="panel"><div className="panel-heading"><div><h2>Application activity</h2><p>Applications by month, based on your saved dates</p></div></div><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyActivity}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="applications" fill="#166534" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        <div className="panel"><div className="panel-heading"><div><h2>Pipeline breakdown</h2><p>Current application statuses</p></div></div><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData.filter((item) => item.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={84}>{statusData.map((item, index) => <Cell key={item.name} fill={chartColors[index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>{jobs.length === 0 && <span className="chart-empty-overlay">Add applications to see your pipeline</span>}</div></div>
      </section>

      <section className="panel upcoming-interviews-panel"><div className="panel-heading"><div><h2>Upcoming interviews</h2><p>Dates you have added to your applications</p></div><Link className="text-button" to="/calendar">Open planner →</Link></div>{upcomingInterviews.length ? upcomingInterviews.map((job) => <article className="calendar-item" key={job.id}><div className="calendar-date"><CalendarDays size={19} /></div><div className="calendar-details"><strong>{job.company} — {job.role}</strong><span>{job.interviewDate}{job.interviewTime ? ` · ${job.interviewTime}` : ""}{job.interviewRound ? ` · ${job.interviewRound}` : ""}</span></div><Link className="text-button" to={`/jobs/${job.id}`}>Details</Link></article>) : <p className="muted">No upcoming interviews yet. Add an interview date to an application to see it here.</p>}</section>

      <section className="panel recent-panel">
        <div className="panel-heading">
          <div><h2>Recent Applications</h2><p>Your latest job opportunities</p></div>
          <Link className="text-button" to="/jobs">View all →</Link>
        </div>

        {jobs.length === 0 ? (
          <p className="muted">No applications yet. Add your first job!</p>
        ) : (
          <div className="job-grid">
            {jobs.slice(0, 6).map(job =>
              <JobCard key={job.id} job={job} onDelete={deleteJob} />
            )}
          </div>
        )}
      </section>
    </>
  );
}
