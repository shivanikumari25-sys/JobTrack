
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import { useJobs } from "../context/JobContext";

const COLORS = ["#5278ee", "#8b5cf6", "#17b981", "#f87171", "#f5a623"];

export default function Analytics() {
  const { jobs } = useJobs();
  const statuses = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

  const data = statuses.map(status => ({
    name: status,
    applications: jobs.filter(job => job.status === status).length
  }));

  const total = jobs.length;
  const responseCount = jobs.filter(job =>
    ["Interview", "Offer", "Rejected"].includes(job.status)
  ).length;

  const responseRate = total ? Math.round(responseCount / total * 100) : 0;

  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow">MEASURE YOUR PROGRESS</p>
          <h1>Analytics & Reports</h1>
          <p className="muted">Insights calculated from your saved applications.</p></div>
      </section>

      <section className="stats-grid">
        <div className="stat-card"><div className="stat-top">Total Applications</div><div className="stat-number">{total}</div></div>
        <div className="stat-card"><div className="stat-top">Interviews</div><div className="stat-number">{data.find(x => x.name === "Interview").applications}</div></div>
        <div className="stat-card"><div className="stat-top">Offers</div><div className="stat-number">{data.find(x => x.name === "Offer").applications}</div></div>
        <div className="stat-card"><div className="stat-top">Response Rate</div><div className="stat-number">{responseRate}%</div></div>
      </section>

      <section className="analytics-grid">
        <div className="panel">
          <div className="panel-heading"><div><h2>Applications by Status</h2><p>Compare each pipeline stage</p></div></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="applications" fill="#5278ee" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading"><div><h2>Application Distribution</h2><p>Share by status</p></div></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="applications" nameKey="name"
                  cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {data.map((item, index) => <Cell key={item.name} fill={COLORS[index]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </>
  );
}
