import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import { useEvents, useServices, usePastors, useChurchInfo, useAnnouncements } from '../hooks/useApi';
import { getImageUrl } from '../utils/imageUtils';
import dciuLogo from '../assets/dciu-logo.png';

export default function Home() {
  // API hooks
  const { data: events, loading: eventsLoading, error: eventsError } = useEvents();
  const { data: services, loading: servicesLoading, error: servicesError } = useServices();
  const { data: pastors, loading: pastorsLoading, error: pastorsError } = usePastors();
  const { data: churchInfo, loading: churchInfoLoading, error: churchInfoError } = useChurchInfo();
  const { data: announcements, loading: announcementsLoading, error: announcementsError } = useAnnouncements();

  // Loading states
  if (eventsLoading || servicesLoading || pastorsLoading || churchInfoLoading || announcementsLoading) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <HeroSection />
      
      {/* Welcome Section */}
      <section className="w-full bg-blue-50 py-16 flex flex-col items-center justify-center text-center px-4">
        <img src={dciuLogo} alt="Logo" className="w-24 h-24 mb-4 mx-auto" />
        <span className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#FFD700', fontFamily: 'serif', letterSpacing: '0.05em' }}>Welcome To</span>
        <span className="text-3xl md:text-5xl font-extrabold mb-4 text-blue-900">
          {churchInfo?.name || 'Deliverance Church International - Kajuki'}
        </span>
        <p className="max-w-2xl mx-auto text-gray-700 text-lg md:text-xl mb-6">
          {churchInfo?.about || 'A center of transformation where lives are changed through the power of God.'}
        </p>
      </section>

      {/* Upcoming Services Section */}
      <section className="w-full py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">Upcoming Services</h2>
        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 justify-items-center">
            {services.slice(0, 3).map((service) => (
              <div key={service.id} className="bg-gray-100 rounded-xl shadow-lg flex flex-col items-center p-6 w-full max-w-sm">
                {service.image && (
                  <img src={getImageUrl(service.image)} alt={service.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <h3 className="text-xl font-bold text-blue-800 mb-2">{service.name}</h3>
                <p className="text-gray-700 text-base">{service.description}</p>
                {service.time && (
                  <p className="text-gray-600 text-sm mt-2">{service.time}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming services available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for service updates!</p>
          </div>
        )}
      </section>

      {/* Announcements Section */}
      <section className="w-full py-16 bg-gradient-to-b from-blue-50 to-white">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">Latest Announcements</h2>
        {announcements && announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 justify-items-center">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-xl shadow-lg flex flex-col items-center p-6 w-full max-w-sm">
                <h3 className="text-xl font-bold text-blue-800 mb-2">{announcement.title}</h3>
                <p className="text-gray-700 text-base mb-1">
                  {new Date(announcement.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-sm mt-2">{announcement.content}</p>
                {announcement.category && (
                  <span className="mt-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {announcement.category}
                  </span>
                )}
                {announcement.is_urgent && (
                  <span className="mt-1 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Urgent
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No announcements available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new announcements!</p>
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="w-full py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">Upcoming Events</h2>
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 justify-items-center">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="bg-blue-50 rounded-xl shadow-lg flex flex-col items-center p-6 w-full max-w-sm">
                {event.image && (
                  <img src={getImageUrl(event.image)} alt={event.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <h3 className="text-xl font-bold text-blue-800 mb-2">{event.title}</h3>
                <p className="text-gray-700 text-base mb-1">
                  {new Date(event.start_date).toLocaleDateString()}
                  {event.end_date && event.end_date !== event.start_date &&
                    ` - ${new Date(event.end_date).toLocaleDateString()}`
                  }
                </p>
                {event.start_time && (
                  <p className="text-gray-600 text-sm">{event.start_time}</p>
                )}
                <p className="text-gray-700 text-sm mt-2">{event.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming events available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new events!</p>
          </div>
        )}
      </section>

      {/* Our Leadership Section */}
      <section className="w-full py-16 bg-white">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-10">Our Leadership</h2>
        {pastors && pastors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 justify-items-center">
            {pastors.slice(0, 3).map((pastor) => (
              <div key={pastor.id} className="bg-blue-50 rounded-xl shadow-lg flex flex-col items-center p-6 w-full max-w-sm">
                {pastor.image && (
                  <img src={getImageUrl(pastor.image)} alt={pastor.name} className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-white shadow" />
                )}
                <h3 className="text-xl font-bold text-blue-800 mb-2 text-center">{pastor.name}</h3>
                <div className="text-blue-700 font-semibold mb-2 text-center">{pastor.title}</div>
                {pastor.bio && (
                  <p className="text-gray-700 text-sm text-center">{pastor.bio}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No leadership information available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for updates!</p>
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section className="w-full py-16 bg-blue-50 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">Contact Us</h2>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full">
          <div className="mb-6">
            <div className="font-bold text-lg mb-1 text-blue-900">Contact Details</div>
            <div className="text-gray-700 mb-1">{churchInfo?.address || 'Address not available'}</div>
            <div className="text-gray-700 mb-1">Phone: {churchInfo?.phone || 'Phone not available'}</div>
            <div className="text-gray-700">Email: {churchInfo?.email || 'Email not available'}</div>
          </div>
          <form className="flex flex-col gap-4">
            <input name="name" placeholder="Your Name" required className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" />
            <input name="email" placeholder="Your Email" type="email" required className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" />
            <textarea name="message" placeholder="Your Message" required className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none min-h-[120px]" />
            <button type="submit" className="border-2 border-blue-700 text-blue-700 rounded px-4 py-2 font-bold hover:bg-blue-700 hover:text-white transition self-end">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  );
} 