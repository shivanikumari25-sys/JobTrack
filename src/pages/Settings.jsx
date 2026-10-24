import { useState } from "react";
import { Download, Trash2, ShieldAlert } from "lucide-react";
import { useJobs } from "../context/JobContext";

export default function Settings() {
  const { jobs } = useJobs();
  const [message, setMessage] = useState("");
  function exportData() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), applications: jobs }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "jobtrack-applications.json"; link.click(); URL.revokeObjectURL(url);
    setMessage("Your application backup has downloaded.");
  }
  function clearData() {
    if (!window.confirm("Delete all applications and saved examples for this browser profile?")) return;
    let email = "guest"; try { email = JSON.parse(localStorage.getItem("jobTrackUser") || "null")?.email?.trim().toLowerCase() || "guest"; } catch { email = "guest"; }
    localStorage.removeItem(`jobtrack:${email}:applications`); localStorage.removeItem(`jobtrack:${email}:saved-jobs`); localStorage.removeItem("careertrack-jobs"); window.location.reload();
  }
  return <section className="settings-page"><div className="welcome-row"><div><p className="eyebrow">PREFERENCES &amp; DATA</p><h1>Settings</h1><p className="muted">Manage application data stored in this browser.</p></div></div><div className="settings-grid"><article className="panel settings-card"><Download size={22} /><h2>Export applications</h2><p>Download a JSON backup of your tracked applications.</p><button className="primary-button" type="button" onClick={exportData}>Download backup</button></article><article className="panel settings-card settings-danger"><ShieldAlert size={22} /><h2>Reset application data</h2><p>Remove saved applications and bookmarked example roles. Your profile will not be deleted.</p><button className="danger-button" type="button" onClick={clearData}><Trash2 size={15} /> Delete local data</button></article></div>{message && <p className="success-message" role="status">{message}</p>}<p className="settings-disclaimer">JobTrack is a browser demo: information is not synced to a server or shared between devices.</p></section>;
}
