import { useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = form.name && form.email && form.message;
    if (!isValid) {
      return;
    }
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div className="container page-block content-page">
      <div className="section-heading center">
        <span className="eyebrow">Get in touch</span>
        <h1>Contact our party experts</h1>
      </div>

      <div className="contact-layout">
        <div className="contact-card">
          <h3>Reach us</h3>
          <ul className="contact-list compact">
            <li>Email: hello@partynest.com</li>
            <li>Phone: +91-89208-85246</li>
            <li>Address: Akabarpur, Behrampur, Ghaziabad, 201009</li>
          </ul>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-grid two-col">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} />
            </label>
            <label>
              Subject
              <input name="subject" value={form.subject} onChange={handleChange} />
            </label>
          </div>

          <label>
            Message
            <textarea name="message" rows="5" value={form.message} onChange={handleChange} required />
          </label>

          <button type="submit" className="primary-btn">Send message</button>
          {submitted && <p className="success-message">Your enquiry has been sent successfully.</p>}
        </form>
      </div>
    </div>
  );
}
