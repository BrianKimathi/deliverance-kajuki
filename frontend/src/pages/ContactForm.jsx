import React, { useState } from 'react';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    alert('Thank you for contacting us!');
    setForm({ name: '', email: '', message: '' });
  };
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Your Email" type="email" required style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" required style={{ display: 'block', marginBottom: 8, width: '100%' }} />
      <button type="submit">Send</button>
    </form>
  );
};

export default ContactForm; 