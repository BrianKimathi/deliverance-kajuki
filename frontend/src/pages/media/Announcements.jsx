import React from 'react';
import { useAnnouncements } from '../../hooks/useApi';

export default function Announcements() {
  const { data: announcements, loading, error } = useAnnouncements();

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">Error loading announcements: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-blue-900">Announcements</h1>
        {announcements && announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-blue-800">{announcement.title}</h2>
                  {announcement.is_urgent && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  {new Date(announcement.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {announcement.category && (
                    <span className="ml-2 text-blue-600">• {announcement.category}</span>
                  )}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No announcements available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for updates!</p>
          </div>
        )}
      </section>
    </main>
  );
} 