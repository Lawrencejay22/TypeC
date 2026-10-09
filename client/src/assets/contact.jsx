import { useState } from "react";
import MatrixBg from "./component/MatrixBg.jsx";
import { post } from "../api.js";
import "./contact.css";

const emptyForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const helpTopics = [
  { title: "Report a Bug", hint: "Something broken?" },
  { title: "Account Issue?", hint: "Can’t sign in?" },
  { title: "Test Problem?", hint: "Results not showing?" },
  { title: "General Question", hint: "Need more info?" },
];

function Contact({ user }) {
  const startForm = () => ({ ...emptyForm, name: user?.username || "", email: user?.email || "" });
  const [formData, setFormData] = useState(startForm);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicClick = (topic) => {
    setFormData((prev) => ({ ...prev, subject: topic.replace("?", "") }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const data = await post("/contact", formData);
      setStatus({ type: "success", text: data.message });
      setFormData(startForm());
    } catch (error) {
      setStatus({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-page">
      <MatrixBg seed={11} />

      <h1 className="contact-title">CONTACT US</h1>

      <div className="contact-grid">
        <div className="contact-card">
          <h2 className="contact-heading">
            SEND US A
            <br />
            MESSAGE
          </h2>
          <p className="contact-text">
            Fill out the form below and we’ll respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <label className="contact-row" htmlFor="name">
              <span>Name</span>
              <input
                id="name"
                type="text"
                name="name"
                maxLength={60}
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label className="contact-row" htmlFor="email">
              <span>Email</span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="yourEmail123@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="contact-row" htmlFor="subject">
              <span>Subject</span>
              <input
                id="subject"
                type="text"
                name="subject"
                maxLength={100}
                placeholder="What is it about?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </label>

            <label className="contact-row" htmlFor="message">
              <span>Message</span>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message"
                rows="4"
                minLength={10}
                maxLength={2000}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </label>

            <div className="contact-actions">
              {status && (
                <p className={`contact-status ${status.type}`}>{status.text}</p>
              )}
              <button type="submit" className="contact-send" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>

        <div className="contact-card">
          <h2 className="contact-heading">NEED HELP?</h2>
          <p className="contact-text">
            Having some trouble with a test, account, or your result? Send us a
            message of what happened. Make sure to add enough detail so that our
            team can understand the problem.
          </p>

          <div className="help-grid">
            {helpTopics.map((topic) => (
              <button
                key={topic.title}
                type="button"
                className={`help-tile ${
                  formData.subject === topic.title.replace("?", "") ? "active" : ""
                }`}
                onClick={() => handleTopicClick(topic.title)}
              >
                <strong>{topic.title}</strong>
                <span>{topic.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="contact-card contact-card-short">
          <h2 className="contact-heading">
            FEEDBACK &amp;
            <br />
            SUGGESTIONS
          </h2>
          <p className="contact-text">
            TypeC is still in development. Share your suggestions, ideas, or send
            a feedback to help us make the typing and coding experience better.
          </p>

          <div className="contact-support">
            <h3>Support us</h3>
            <a href="mailto:typecteam@gmail.com">typeCteam@gmail.com</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
