
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobContext";

const localDate = new Date();
localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

const emptyJob = {
  company: "",
  role: "",
  date: localDate.toISOString().slice(0, 10),
  status: "Applied",
  type: "Full-time",
  location: "Remote",
  jobUrl: "",
  applicationUrl: "",
  source: "",
  contactPerson: "",
  salary: "",
  notes: "",
  interviewDate: "",
  interviewTime: "",
  interviewRound: "",
  interviewFormat: "Online",
  meetingLink: "",
  preparationNotes: "",
  followUpDate: ""
};

export default function JobForm({ initialJob = null }) {
  const [form, setForm] = useState({ ...emptyJob, ...initialJob });
  const [error, setError] = useState("");
  const { addJob, updateJob } = useJobs();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setError("");
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.company.trim() || !form.role.trim()) {
      setError("Company name and job title are required.");
      return;
    }

    if (initialJob) {
      updateJob(initialJob.id, {
        ...form,
        company: form.company.trim(),
        role: form.role.trim(),
        salary: form.salary.trim(),
        notes: form.notes.trim()
      });
    } else {
      addJob({
        ...form,
        company: form.company.trim(),
        role: form.role.trim(),
        salary: form.salary.trim(),
        notes: form.notes.trim()
      });
    }

    navigate("/jobs");
  }

  return (
    <form className="job-form panel" onSubmit={handleSubmit}>
      <div>
        <h2>{initialJob ? "Edit Application" : "Add Job Application"}</h2>
        <p className="muted">Enter the details of your job opportunity.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="form-row">
        <label>Company name *
          <input name="company" required value={form.company}
            onChange={handleChange} placeholder="e.g. Google" />
        </label>
        <label>Job title *
          <input name="role" required value={form.role}
            onChange={handleChange} placeholder="e.g. React Developer" />
        </label>
      </div>

      <div className="form-row">
        <label>Application date
          <input name="date" type="date" value={form.date}
            onChange={handleChange} />
        </label>
        <label>Status
          <select name="status" value={form.status} onChange={handleChange}>
            {["Wishlist", "Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"].map(s =>
              <option key={s}>{s}</option>
            )}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>Job posting URL<input name="jobUrl" type="url" value={form.jobUrl} onChange={handleChange} placeholder="https://company.com/jobs/role" /></label>
        <label>Application URL<input name="applicationUrl" type="url" value={form.applicationUrl} onChange={handleChange} placeholder="https://company.com/apply" /></label>
      </div>

      <div className="form-row">
        <label>Job type
          <select name="type" value={form.type} onChange={handleChange}>
            {["Full-time", "Internship", "Part-time", "Contract"].map(t =>
              <option key={t}>{t}</option>
            )}
          </select>
        </label>
        <label>Work mode
          <select name="location" value={form.location} onChange={handleChange}>
            {["Remote", "Hybrid", "On-site"].map(l =>
              <option key={l}>{l}</option>
            )}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>Salary / stipend
          <input name="salary" value={form.salary}
            onChange={handleChange} placeholder="e.g. ₹5 LPA" />
        </label>
        <label>Interview date
          <input name="interviewDate" type="date"
            value={form.interviewDate} onChange={handleChange} />
        </label>
      </div>

      <div className="form-row">
        <label>Next follow-up date<input name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} /></label>
        <label>Recruiter / contact person<input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="Name or contact details" /></label>
      </div>

      <div className="form-row">
        <label>Interview time<input name="interviewTime" type="time" value={form.interviewTime} onChange={handleChange} /></label>
        <label>Interview round<input name="interviewRound" value={form.interviewRound} onChange={handleChange} placeholder="e.g. Technical round" /></label>
      </div>

      <div className="form-row">
        <label>Interview format<select name="interviewFormat" value={form.interviewFormat} onChange={handleChange}><option>Online</option><option>Phone</option><option>In-person</option></select></label>
        <label>Meeting link<input name="meetingLink" type="url" value={form.meetingLink} onChange={handleChange} placeholder="https://meeting.example" /></label>
      </div>

      <label>Notes
        <textarea name="notes" value={form.notes}
          onChange={handleChange} placeholder="Recruiter details, next steps..." rows={4} />
      </label>
      <label>Interview preparation notes<textarea name="preparationNotes" value={form.preparationNotes} onChange={handleChange} placeholder="Topics to prepare, questions to ask..." rows={3} /></label>
      <label>Job source<input name="source" value={form.source} onChange={handleChange} placeholder="Company site, referral, job board..." /></label>

      <div className="modal-actions">
        <button type="button" className="secondary-button"
          onClick={() => navigate("/jobs")}>Cancel</button>
        <button className="primary-button" type="submit">
          {initialJob ? "Update application" : "Save application"}
        </button>
      </div>
    </form>
  );
}
