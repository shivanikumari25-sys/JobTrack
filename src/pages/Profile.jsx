import { useMemo, useState } from "react";
import {
  UserRound, GraduationCap, Brain, Languages, BriefcaseBusiness, MapPin,
  Mail, Linkedin, Github, Globe2, Save, Send, Check, ShieldCheck
} from "lucide-react";

const tabs = [
  { id: "personal", label: "Personal", icon: UserRound },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Brain },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "career", label: "Career Goals", icon: BriefcaseBusiness },
  { id: "openFor", label: "Open For", icon: Globe2 },
];

const emptyProfile = {
  name: "", email: "", phone: "", campus: "", placementCycle: "October 2026",
  pincode: "", hometown: "", district: "", state: "", linkedin: "", github: "",
  portfolio: "", about: "", degree: "", institution: "", graduationYear: "",
  skills: "", languages: "", desiredRole: "", preferredLocation: "", workMode: "Any",
  openFor: ["Full-time", "Internship"], governmentJobInterest: false,
  governmentJobTypes: [], resumeFileName: "", resumeDataUrl: "", resumeUploadedAt: "",
  approvalStatus: "Not submitted", approvalRequestedAt: ""
};

function readSavedProfile() {
  try {
    const value = JSON.parse(localStorage.getItem("jobTrackUser") || "null");
    return {
      ...emptyProfile,
      ...(value || {}),
      openFor: Array.isArray(value?.openFor) ? value.openFor : emptyProfile.openFor,
      governmentJobTypes: Array.isArray(value?.governmentJobTypes) ? value.governmentJobTypes : []
    };
  } catch {
    return emptyProfile;
  }
}

export default function Profile() {
  const [profile, setProfile] = useState(readSavedProfile);
  const [activeTab, setActiveTab] = useState("personal");
  const [notice, setNotice] = useState("");

  const checks = useMemo(() => [
    ["Personal details", Boolean(profile.name && profile.email)],
    ["Education", Boolean(profile.degree || profile.institution)],
    ["Skills", Boolean(profile.skills.trim())],
    ["English level", Boolean(profile.languages.trim())],
    ["Open for roles", Boolean(profile.openFor.length)],
    ["Resume / portfolio", Boolean(profile.resumeFileName || profile.portfolio || profile.linkedin || profile.github)],
    ["Job preferences", Boolean(profile.openFor.length || (profile.governmentJobInterest && profile.governmentJobTypes.length))],
  ], [profile]);
  const completion = Math.round((checks.filter(([, complete]) => complete).length / checks.length) * 100);

  function updateField(event) {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value, approvalStatus: previous.approvalStatus === "Approved" ? "Changes pending approval" : previous.approvalStatus }));
    setNotice("");
  }

  function saveProfile(nextProfile = profile, message = "Profile saved in this browser.") {
    try {
      localStorage.setItem("jobTrackUser", JSON.stringify(nextProfile));
      setProfile(nextProfile);
      setNotice(message);
    } catch {
      setNotice("Could not save profile. Check browser storage settings.");
    }
  }

  function handleSave(event) {
    event.preventDefault();
    const approvalStatus = profile.approvalStatus === "Approved" ? "Changes pending approval" : profile.approvalStatus;
    saveProfile({ ...profile, name: profile.name.trim(), email: profile.email.trim(), approvalStatus });
  }

  function submitForApproval() {
    if (!profile.name.trim() || !profile.email.trim()) {
      setNotice("Add your name and email before requesting profile approval.");
      setActiveTab("personal");
      return;
    }
    if (profile.governmentJobInterest && !profile.governmentJobTypes.length) {
      setNotice("Select at least one government job category or turn off the government job preference.");
      setActiveTab("openFor");
      return;
    }
    saveProfile({
      ...profile,
      approvalStatus: "Pending review",
      approvalRequestedAt: new Date().toISOString()
    }, "Approval request saved in this browser demo. It has not been sent to a placement team.");
  }

  function toggleRole(role) {
    setProfile((previous) => ({
      ...previous,
      approvalStatus: previous.approvalStatus === "Approved" ? "Changes pending approval" : previous.approvalStatus,
      openFor: previous.openFor.includes(role)
        ? previous.openFor.filter((item) => item !== role)
        : [...previous.openFor, role]
    }));
  }

  function toggleGovernmentRole(role) {
    setProfile((previous) => ({
      ...previous,
      governmentJobInterest: true,
      approvalStatus: previous.approvalStatus === "Approved" ? "Changes pending approval" : previous.approvalStatus,
      governmentJobTypes: previous.governmentJobTypes.includes(role)
        ? previous.governmentJobTypes.filter((item) => item !== role)
        : [...previous.governmentJobTypes, role]
    }));
    setNotice("");
  }

  function handleResumeUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      setNotice("Choose a PDF, DOC, or DOCX resume file.");
      event.target.value = "";
      return;
    }
    if (file.size > 1024 * 1024) {
      setNotice("Resume must be 1 MB or smaller for this browser demo.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((previous) => ({
        ...previous,
        approvalStatus: previous.approvalStatus === "Approved" ? "Changes pending approval" : previous.approvalStatus,
        resumeFileName: file.name,
        resumeDataUrl: String(reader.result),
        resumeUploadedAt: new Date().toISOString()
      }));
      setNotice("Resume attached. Save your profile to keep it in this browser.");
    };
    reader.onerror = () => setNotice("Could not read this file. Please try another resume.");
    reader.readAsDataURL(file);
  }

  function removeResume() {
    setProfile((previous) => ({ ...previous, approvalStatus: previous.approvalStatus === "Approved" ? "Changes pending approval" : previous.approvalStatus, resumeFileName: "", resumeDataUrl: "", resumeUploadedAt: "" }));
    setNotice("Resume removed. Save your profile to confirm the change.");
  }

  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label;

  return (
    <main className="placement-profile">
      <div className="profile-page-heading">
        <div>
          <span className="eyebrow">PLACEMENT WORKSPACE</span>
          <h1>My Profile</h1>
          <p>Manage your personal, academic, and career information.</p>
        </div>
        <div className="profile-heading-actions">
          <button className="primary-button" type="button" onClick={submitForApproval}>
            <Send size={16} /> Submit for Approval
          </button>
          <span className={`approval-badge ${profile.approvalStatus === "Approved" ? "is-approved" : "is-pending"}`}>
            <ShieldCheck size={15} /> {profile.approvalStatus}
          </span>
        </div>
      </div>

      <div className="profile-dashboard-grid">
        <section className="profile-editor panel">
          <div className="profile-tabs" role="tablist" aria-label="Profile sections">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                className={`profile-tab ${activeTab === id ? "active" : ""}`}
                type="button"
                role="tab"
                id={`profile-tab-${id}`}
                aria-selected={activeTab === id}
                aria-controls="profile-tab-panel"
                key={id}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave}>
            <div className="profile-tab-panel" id="profile-tab-panel" role="tabpanel" aria-labelledby={`profile-tab-${activeTab}`}>
              <div className="profile-section-title">
                <div><h2>{activeTabLabel} Information</h2><p>Keep your profile accurate and up to date.</p></div>
                {activeTab === "personal" && <span className="verified-chip"><ShieldCheck size={13} /> Profile details</span>}
              </div>

              {activeTab === "personal" && <>
                <div className="profile-field-grid">
                  <label className="profile-field">Full name<input name="name" value={profile.name} onChange={updateField} placeholder="Your full name" required /></label>
                  <label className="profile-field">Email address<div className="profile-input-icon"><Mail size={15} /><input name="email" type="email" value={profile.email} onChange={updateField} placeholder="you@example.com" required /></div></label>
                  <label className="profile-field">Phone number<input name="phone" type="tel" value={profile.phone} onChange={updateField} placeholder="+91 98765 43210" /></label>
                  <label className="profile-field">Campus<select name="campus" value={profile.campus} onChange={updateField}><option value="">Select your campus</option><option>Kishanganj</option><option>Udaipur</option><option>Bangalore</option><option>Other</option></select><small>Select your campus location</small></label>
                  <label className="profile-field">Placement cycle<input value={profile.placementCycle} readOnly /><small>Current active placement cycle</small></label>
                </div>
                <div className="profile-subsection">
                  <h3><MapPin size={17} /> Hometown</h3>
                  <div className="profile-field-grid four-columns">
                    <label className="profile-field">Pincode<input name="pincode" inputMode="numeric" value={profile.pincode} onChange={updateField} placeholder="e.g. 110001" maxLength={10} /></label>
                    <label className="profile-field">Village / Town<input name="hometown" value={profile.hometown} onChange={updateField} placeholder="Your town" /></label>
                    <label className="profile-field">District<input name="district" value={profile.district} onChange={updateField} placeholder="District" /></label>
                    <label className="profile-field">State<input name="state" value={profile.state} onChange={updateField} placeholder="State" /></label>
                  </div>
                </div>
                <div className="profile-subsection">
                  <h3>Social &amp; Portfolio Links</h3>
                  <div className="profile-field-grid three-columns">
                    <label className="profile-field">LinkedIn<div className="profile-input-icon"><Linkedin size={15} /><input name="linkedin" type="url" value={profile.linkedin} onChange={updateField} placeholder="https://linkedin.com/in/..." /></div></label>
                    <label className="profile-field">GitHub<div className="profile-input-icon"><Github size={15} /><input name="github" type="url" value={profile.github} onChange={updateField} placeholder="https://github.com/..." /></div></label>
                    <label className="profile-field">Portfolio<div className="profile-input-icon"><Globe2 size={15} /><input name="portfolio" type="url" value={profile.portfolio} onChange={updateField} placeholder="https://your-portfolio.com" /></div></label>
                  </div>
                </div>
                <label className="profile-field">About me<textarea name="about" value={profile.about} onChange={updateField} rows={5} maxLength={1000} placeholder="Share a short introduction, your strengths, and the kind of opportunities you are looking for." /><small>{profile.about.length}/1000 characters</small></label>
              </>}

              {activeTab === "education" && <div className="profile-field-grid">
                <label className="profile-field">Highest qualification<input name="degree" value={profile.degree} onChange={updateField} placeholder="e.g. B.A. History Honours" /></label>
                <label className="profile-field">College / Institution<input name="institution" value={profile.institution} onChange={updateField} placeholder="Institution name" /></label>
                <label className="profile-field">Graduation year<input name="graduationYear" type="number" min="1990" max="2100" value={profile.graduationYear} onChange={updateField} placeholder="2026" /></label>
              </div>}

              {activeTab === "skills" && <label className="profile-field">Skills<textarea name="skills" value={profile.skills} onChange={updateField} rows={6} placeholder="Add skills separated by commas, e.g. HTML, CSS, JavaScript, React" /><small>Use commas to separate skills.</small></label>}

              {activeTab === "languages" && <label className="profile-field">Languages and proficiency<textarea name="languages" value={profile.languages} onChange={updateField} rows={5} placeholder="e.g. Hindi — Native, English — Professional" /><small>Include your proficiency level for each language.</small></label>}

              {activeTab === "career" && <div className="profile-field-grid">
                <label className="profile-field">Desired role<input name="desiredRole" value={profile.desiredRole} onChange={updateField} placeholder="e.g. Frontend Developer" /></label>
                <label className="profile-field">Preferred location<input name="preferredLocation" value={profile.preferredLocation} onChange={updateField} placeholder="City, state, or anywhere" /></label>
                <label className="profile-field">Work preference<select name="workMode" value={profile.workMode} onChange={updateField}><option>Any</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label>
              </div>}

              {activeTab === "openFor" && <div className="open-for-section">
                <p className="form-description">Choose private-sector opportunities, government jobs, or both. These preferences help organise your search; they do not submit applications or register you for exams.</p>
                <fieldset className="open-for-options"><legend>Employment opportunities</legend>{["Full-time", "Internship", "Part-time", "Contract", "Apprenticeship"].map((role) => <label key={role}><input type="checkbox" checked={profile.openFor.includes(role)} onChange={() => toggleRole(role)} />{role}</label>)}</fieldset>
                <fieldset className="government-preferences">
                  <legend>Government job preparation</legend>
                  <label className="government-interest-toggle"><input type="checkbox" name="governmentJobInterest" checked={profile.governmentJobInterest} onChange={(event) => {
                    setProfile((previous) => ({
                      ...previous,
                      governmentJobInterest: event.target.checked,
                      approvalStatus: previous.approvalStatus === "Approved" ? "Changes pending approval" : previous.approvalStatus,
                      governmentJobTypes: event.target.checked ? previous.governmentJobTypes : []
                    }));
                    setNotice("");
                  }} /><span><strong>I'm interested in government jobs</strong><small>Enable this if you are preparing for public-sector recruitment or competitive exams.</small></span></label>
                  {profile.governmentJobInterest && <div className="government-job-type-grid">{["UPSC / Civil Services", "SSC", "Banking", "Railways", "State PSC", "Defence", "Teaching / Eligibility tests", "PSU / Public sector", "Other government roles"].map((role) => <label key={role}><input type="checkbox" checked={profile.governmentJobTypes.includes(role)} onChange={() => toggleGovernmentRole(role)} />{role}</label>)}</div>}
                </fieldset>
              </div>}
            </div>

            <div className="profile-form-footer">
              {notice && <p className="profile-save-notice" role="status">{notice}</p>}
              <div className="profile-footer-actions"><button className="primary-button" type="submit"><Save size={16} /> Save Profile</button><button className="approval-request-button" type="button" onClick={submitForApproval}><Send size={15} /> Request approval</button></div>
            </div>
          </form>
        </section>

        <aside className="profile-progress-column">
          <section className="profile-progress-card">
            <div className="profile-avatar-large">{profile.name ? profile.name.trim().charAt(0).toUpperCase() : <UserRound size={27} />}</div>
            <h2>{profile.name || "Your name"}</h2>
            <p>{profile.desiredRole || profile.email || "Complete your profile to get started"}</p>
            <div className="completion-heading"><strong>Profile completion</strong><strong>{completion}%</strong></div>
            <div className="completion-track"><span style={{ width: `${completion}%` }} /></div>
            <span className="completion-caption">A complete profile helps employers understand your strengths.</span>
          </section>

          <section className="profile-resources-card">
            <h2><BriefcaseBusiness size={16} /> Resume &amp; portfolio</h2>
            {profile.resumeFileName ? <div className="resume-file-row">
              <span><strong>{profile.resumeFileName}</strong><small>Saved locally in this browser</small></span>
              {profile.resumeDataUrl && <a href={profile.resumeDataUrl} download={profile.resumeFileName}>Download</a>}
              <button type="button" onClick={removeResume} aria-label="Remove resume">Remove</button>
            </div> : <p className="resume-empty-copy">Add a resume file or use the LinkedIn, GitHub, and portfolio links in Personal Information.</p>}
            <label className="resume-upload-control"><input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleResumeUpload} /><span><BriefcaseBusiness size={15} /> {profile.resumeFileName ? "Replace resume" : "Upload resume"}</span></label>
            <small className="resume-limit-note">PDF, DOC, DOCX · Max 1 MB in this browser demo. Files are not uploaded to a server.</small>
            <div className="profile-social-links">{[["LinkedIn", profile.linkedin], ["GitHub", profile.github], ["Portfolio", profile.portfolio]].filter(([, url]) => url).map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer">{label}<Globe2 size={12} /></a>)}</div>
          </section>

          <section className="profile-checklist-card">
            <div className="profile-checklist-heading"><h2>Profile checklist</h2><span>{checks.filter(([, complete]) => complete).length}/{checks.length}</span></div>
            <ul>{checks.map(([label, complete]) => <li key={label}><span className={complete ? "check-icon complete" : "check-icon"}>{complete ? <Check size={13} /> : null}</span>{label}</li>)}</ul>
          </section>
          <p className="profile-local-note">Profile and approval requests are stored only in this browser demo. No placement team is notified.</p>
        </aside>
      </div>
    </main>
  );
}
