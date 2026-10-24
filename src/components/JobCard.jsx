
import { CalendarDays, MapPin, Trash2, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job, onDelete }) {
  const navigate = useNavigate();

  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-logo">
          {job.company?.charAt(0).toUpperCase()}
        </div>
        <span className={`status-badge badge-${job.status.toLowerCase()}`}>
          {job.status}
        </span>
      </div>

      <p className="company-name">{job.company}</p>
      <h3>{job.role}</h3>

      <div className="job-info">
        <span><CalendarDays size={14} /> {job.date || "No date"}</span>
        <span><MapPin size={14} /> {job.location || "Not specified"}</span>
      </div>

      <div className="job-tags">
        <span>{job.type || "Full-time"}</span>
        <span>{job.salary || "Salary not specified"}</span>
      </div>

      <div className="job-card-bottom">
        <button
          className="text-button"
          onClick={() => navigate(`/jobs/${job.id}`)}
        >
          <Eye size={15} /> Details
        </button>

        <button className="text-button" onClick={() => navigate(`/jobs/${job.id}/edit`)} aria-label={`Edit ${job.company} application`}>
          <Pencil size={14} /> Edit
        </button>

        <button
          className="delete-button"
          onClick={() => {
            if (window.confirm(`Delete the ${job.role} application at ${job.company}?`)) {
              onDelete(job.id);
            }
          }}
          aria-label={`Delete ${job.company} application`}
        >
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </article>
  );
}
