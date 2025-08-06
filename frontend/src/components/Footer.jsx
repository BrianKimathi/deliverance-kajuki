import React, { useState } from 'react';
import dciuLogo from '../assets/dciu-logo.png';
import apiService from '../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('Please enter your email address');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      await apiService.subscribe(email, name);
      setStatus('Successfully subscribed!');
      setEmail('');
      setName('');
    } catch (error) {
      console.error('Subscription error:', error);
      if (error.message.includes('already subscribed')) {
        setStatus('You are already subscribed!');
      } else {
        setStatus('Failed to subscribe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <footer className="w-full bg-white text-black py-10 mt-10 border-t-2 border-gray-300 rounded-t-xl">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <img src={dciuLogo} alt="Logo" className="w-16 h-16 mb-2" />
        <div className="font-bold text-lg mb-1">Deliverance church Int'l - Kajuki</div>
        <div className="text-sm text-gray-600">A center of transformation.</div>
      </div>
      <div>
        <div className="font-bold mb-2">Navigation</div>
        <ul className="space-y-1 text-gray-700">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="/about" className="hover:underline">About</a></li>
          <li><a href="/ministries" className="hover:underline">Ministries</a></li>
          <li><a href="/media" className="hover:underline">Media</a></li>
          <li><a href="/contact" className="hover:underline">Contact</a></li>
          <li><a href="/giving" className="hover:underline">Giving</a></li>
          <li><a href="/events" className="hover:underline">Events</a></li>
        </ul>
      </div>
      <div>
        <div className="font-bold mb-2">Newsletter</div>
        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
          <input 
            type="text" 
            placeholder="Your Name (Optional)" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" 
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" 
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="border-2 border-blue-700 text-blue-700 rounded px-4 py-2 font-bold hover:bg-blue-700 hover:text-white transition disabled:opacity-50"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
          {status && (
            <div className={`text-sm ${status.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </div>
          )}
        </form>
      </div>
      <div>
        <div className="font-bold mb-2">Contact</div>
        <div className="text-gray-600 text-sm">P.O. Box 123, Kajuki, Kenya</div>
        <div className="text-gray-600 text-sm">Phone: +254 700 000 000</div>
        <div className="text-gray-600 text-sm">Email: info@dciukajuki.org</div>
      </div>
    </div>
    <div className="text-center text-gray-400 text-xs mt-8">&copy; {new Date().getFullYear()} Deliverance church Int'l - Kajuki. All rights reserved.</div>
  </footer>
);
};

export default Footer; 