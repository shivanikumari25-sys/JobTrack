
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const registeredUser = JSON.parse(localStorage.getItem("jobTrackUser") || "null");
    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }
    if (!registeredUser?.email) {
      setError("No browser demo profile found. Create an account first.");
      return;
    }
    if (registeredUser.email.toLowerCase() !== email.trim().toLowerCase()) {
      setError("No account found for this email. Please sign up first.");
      return;
    }
    // This prototype has no authentication backend; never persist the password.
    localStorage.setItem("jobTrackSession", "active");
    navigate("/dashboard");
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand-icon auth-icon">J</div>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to your JobTrack workspace.</p>
        <p className="auth-demo-notice">Prototype mode: this form uses a browser profile and does not securely verify passwords.</p>

        <label>Email address
          <input type="email" required value={email}
            onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label>Password
          <input type="password" required value={password}
            onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button auth-submit" type="submit">Sign in</button>
        <p className="auth-footer">Don't have an account? <Link to="/signup">Create account</Link></p>
      </form>
    </div>
  );
}
