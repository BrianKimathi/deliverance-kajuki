import React, { useState } from 'react';
import { useChurchInfo } from '../hooks/useApi';
import apiService from '../services/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { data: churchInfo, loading: churchInfoLoading } = useChurchInfo();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      await apiService.submitContactForm(form);
      setSubmitStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact form submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-blue-900">Contact Us</h1>
        <p className="text-lg text-center text-gray-700 mb-8">We would love to hear from you! Reach out for prayer, support, or any inquiries.</p>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <div className="font-bold text-lg mb-1 text-blue-900">Contact Details</div>
            <div className="text-gray-700 mb-1">
              {churchInfoLoading ? 'Loading...' : (churchInfo?.address || 'P.O. Box 123, Kajuki, Kenya')}
            </div>
            <div className="text-gray-700 mb-1">
              Phone: {churchInfoLoading ? 'Loading...' : (churchInfo?.phone || '+254 700 000 000')}
            </div>
            <div className="text-gray-700">
              Email: {churchInfoLoading ? 'Loading...' : (churchInfo?.email || 'info@dciukajuki.org')}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="Your Name" 
              required 
              className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <input 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="Your Email" 
              type="email" 
              required 
              className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <textarea 
              name="message" 
              value={form.message} 
              onChange={handleChange} 
              placeholder="Your Message" 
              required 
              className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]" 
            />
            
            {submitStatus === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Sorry, there was an error sending your message. Please try again.
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={submitting}
              className="border-2 border-blue-700 text-blue-700 rounded px-4 py-2 font-bold hover:bg-blue-700 hover:text-white transition self-end disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
} 