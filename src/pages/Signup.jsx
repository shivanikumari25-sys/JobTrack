
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError("Please complete every field. Your password must be at least 6 characters.");
      return;
    }

    // Keep profile details only; never store a password in browser storage.
    localStorage.setItem("jobTrackUser", JSON.stringify({ name: name.trim(), email: email.trim() }));
    localStorage.setItem("jobTrackSession", "active");
    navigate("/dashboard");
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand-icon auth-icon">J</div>
        <h1>Create your account</h1>
        <p className="muted">Start organising your job search.</p>
        <p className="auth-demo-notice">Prototype mode: profile data is stored only in this browser. Passwords are not saved.</p>

        <label>Full name
          <input required value={name} onChange={e => setName(e.target.value)}
            placeholder="Your name" />
        </label>
        <label>Email address
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" />
        </label>
        <label>Password (at least 6 characters)
          <input type="password" required minLength={6} value={password}
            onChange={e => setPassword(e.target.value)} placeholder="Create password" />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button auth-submit" type="submit">Create account</button>
        <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}
