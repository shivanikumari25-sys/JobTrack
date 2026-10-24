
import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Send,
  CircleHelp,
} from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    let emailKey = "guest";
    try {
      emailKey = JSON.parse(localStorage.getItem("jobTrackUser") || "null")?.email?.toLowerCase() || "guest";
      const key = `jobtrack:${emailKey}:messages`;
      const parsed = JSON.parse(localStorage.getItem(key) || "[]");
      const messages = Array.isArray(parsed) ? parsed : [];
      messages.push({ ...form, createdAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(messages));
    } catch {
      setError("Could not save this message in browser storage. Please try again.");
      return;
    }

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setSuccess(
      "Saved in this browser demo only; this message was not emailed to support."
    );
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <span className="eyebrow">GET IN TOUCH</span>
        <h1>Contact Us</h1>
        <p>
          Have a question, feedback, or suggestion?
          We would love to hear from you.
        </p>
      </div>

      <section className="contact-layout">
        <aside className="contact-info">
          <div className="contact-icon">
            <MessageSquare size={27} />
          </div>

          <h2>Let's talk!</h2>

          <p>
            Job Track helps you organize your job applications.
            Send us your feedback or tell us how we can improve
            your job-search experience.
          </p>

          <div className="contact-detail">
            <div className="contact-detail-icon">
              <Mail size={20} />
            </div>
            <div>
              <strong>Email Support</strong>
              <p>Use the form to send your message.</p>
            </div>
          </div>

          <div className="contact-detail">
            <div className="contact-detail-icon">
              <CircleHelp size={20} />
            </div>
            <div>
              <strong>Need Help?</strong>
              <p>Share your question or issue with us.</p>
            </div>
          </div>
        </aside>

        <form className="form-card contact-form" onSubmit={handleSubmit}>
          <h2>Send a Message</h2>

          <label htmlFor="contact-name">Full Name</label>
          <input
            id="contact-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="What is your message about?"
            required
          />

          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            required
          />

          {success && (
            <p className="success-message" role="status">
              {success}
            </p>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn btn-primary submit-btn" type="submit">
            <Send size={17} />
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
