import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    alert('Subscribed!');
    setEmail('');
  };
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ display: 'block', marginBottom: 8, width: '100%' }}
      />
      <button type="submit">Subscribe</button>
    </form>
  );
};

export default Newsletter; 