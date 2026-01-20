import React from "react";
import "./Contact.css";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! This form is static.");
  };

  return (
    <main className="contact">
      <section className="contact-card">
        <h1>Contact</h1>
        <p>Have a question or a thought worth sharing? Send it.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label>
            Name
            <input type="text" placeholder="Jane Doe" required />
          </label>

          <label>
            Email
            <input type="email" placeholder="jane@example.com" required />
          </label>

          <label>
            Message
            <textarea placeholder="Say something sharp." rows="5" required />
          </label>

          <button type="submit">Send Message</button>
        </form>
      </section>
    </main>
  );
}
