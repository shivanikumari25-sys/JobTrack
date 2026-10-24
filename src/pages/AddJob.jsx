
import JobForm from "../components/JobForm";

export default function AddJob() {
  return (
    <div className="form-page">
      <p className="eyebrow">NEW OPPORTUNITY</p>
      <h1>Add Job Application</h1>
      <p className="muted">Keep all your job search details organised.</p>
      <JobForm />
    </div>
  );
}
