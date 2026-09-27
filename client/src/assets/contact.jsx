import { useState } from "react";
import "./contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTopicClick = (topic) => {
    setFormData((prev) => ({
      ...prev,
      subject: topic,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("");
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setStatus("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus(error.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-header">
        <span className="contact-label">Contact Page</span>
        <h1>CONTACT US</h1>
      </div>

      <div className="contact-grid">
        {/* SEND MESSAGE */}
        <section className="contact-card">
          <h2>
            SEND US A
            <br />
            MESSAGE
          </h2>

          <p className="contact-description">
            Fill out the form below and we'll respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="YourEmail123@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>

              <input
                id="subject"
                type="text"
                name="subject"
                placeholder="What is it about?"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>

              <textarea
                id="message"
                name="message"
                placeholder="Write your message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="send-button"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>

            {status && (
              <p
                className={`form-status ${
                  status.includes("successfully") ? "success" : "error"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </section>

        {/* NEED HELP */}
        <section className="contact-card help-card">
          <h2>NEED HELP?</h2>

          <p className="contact-description">
            Having some trouble with a test, account, or your result? Send us
            a message of what happened. Make sure to add some details so that
            our team can understand the problem.
          </p>

          <div className="help-grid">
            <button
              type="button"
              onClick={() => handleTopicClick("Report a Bug")}
            >
              <strong>Report a Bug</strong>
              <span>Something broken?</span>
            </button>

            <button
              type="button"
              onClick={() => handleTopicClick("Account Issue")}
            >
              <strong>Account Issue?</strong>
              <span>Can't sign in?</span>
            </button>

            <button
              type="button"
              onClick={() => handleTopicClick("Test Problem")}
            >
              <strong>Test Problem?</strong>
              <span>Results not showing?</span>
            </button>

            <button
              type="button"
              onClick={() => handleTopicClick("General Question")}
            >
              <strong>General Question</strong>
              <span>Need more info?</span>
            </button>
          </div>
        </section>

        {/* FEEDBACK */}
        <section className="contact-card feedback-card">
          <h2>
            FEEDBACK &
            <br />
            SUGGESTIONS
          </h2>

          <p className="contact-description">
            TypeC is still in development. Share your suggestions, ideas, or
            send a feedback to help us make the typing and coding experience
            better.
          </p>

          <div className="support">
            <h3>Support us</h3>

            <a href="mailto:typecteam@gmail.com">
              typecteam@gmail.com
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Contact;
