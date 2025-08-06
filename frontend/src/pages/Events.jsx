import React from 'react';
import { useEvents } from '../hooks/useApi';
import { getImageUrl } from '../utils/imageUtils';

export default function Events() {
  const { data: events, loading, error } = useEvents();

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-600">Error loading events: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-blue-900">Upcoming Events</h1>
        <p className="text-lg text-center text-gray-700 mb-12">Join us for these exciting events and opportunities to grow together in faith.</p>
        
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {event.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={getImageUrl(event.image)} 
                      alt={event.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">{event.title}</h3>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {new Date(event.start_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {event.end_date && event.end_date !== event.start_date && (
                          <span> - {new Date(event.end_date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        )}
                      </span>
                    </div>
                    
                    {event.start_time && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{event.start_time}</span>
                        {event.end_time && event.end_time !== event.start_time && (
                          <span> - {event.end_time}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {event.is_multiday && (
                    <div className="mt-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Multi-day Event
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming events at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new events!</p>
          </div>
        )}
      </section>
    </main>
  );
} 