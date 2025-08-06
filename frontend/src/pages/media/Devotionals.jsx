import React from 'react';
import { useDevotionals } from '../../hooks/useApi';

export default function Devotionals() {
  const { data: devotionals, loading, error } = useDevotionals();

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading devotionals...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-600">Error loading devotionals: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-blue-900">Daily Devotionals</h1>
        <p className="text-lg text-center text-gray-700 mb-12">Start your day with these inspiring devotionals to strengthen your faith and deepen your relationship with God.</p>
        
        {devotionals && devotionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devotionals.map((devotional) => (
              <div key={devotional.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {devotional.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={devotional.image} 
                      alt={devotional.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">{devotional.title}</h3>
                  {devotional.author && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Author:</span> {devotional.author}
                    </p>
                  )}
                  {devotional.date && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Date:</span> {new Date(devotional.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {devotional.scripture_reference && (
                    <p className="text-gray-600 mb-4">
                      <span className="font-semibold">Scripture:</span> {devotional.scripture_reference}
                    </p>
                  )}
                  {devotional.content && (
                    <div className="text-gray-700 mb-4">
                      <div className="line-clamp-4" dangerouslySetInnerHTML={{ __html: devotional.content }} />
                    </div>
                  )}
                  
                  {devotional.audio_url && (
                    <div className="mt-4">
                      <audio controls className="w-full">
                        <source src={devotional.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  
                  {devotional.video_url && (
                    <div className="mt-4">
                      <a 
                        href={devotional.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                      >
                        Watch Video
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No devotionals available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new devotionals!</p>
          </div>
        )}
      </section>
    </main>
  );
} 