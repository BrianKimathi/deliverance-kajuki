import React from 'react';
import { useSermons } from '../../hooks/useApi';

export default function Sermons() {
  const { data: sermons, loading, error } = useSermons();

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sermons...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-600">Error loading sermons: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-blue-900">Sermons</h1>
        <p className="text-lg text-center text-gray-700 mb-12">Listen to our latest sermons and teachings to grow in your faith.</p>
        
        {sermons && sermons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sermons.map((sermon) => (
              <div key={sermon.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {sermon.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={sermon.image} 
                      alt={sermon.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">{sermon.title}</h3>
                  {sermon.preacher && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Preacher:</span> {sermon.preacher}
                    </p>
                  )}
                  {sermon.date && (
                    <p className="text-gray-600 mb-2">
                      <span className="font-semibold">Date:</span> {new Date(sermon.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  {sermon.scripture_reference && (
                    <p className="text-gray-600 mb-4">
                      <span className="font-semibold">Scripture:</span> {sermon.scripture_reference}
                    </p>
                  )}
                  {sermon.description && (
                    <p className="text-gray-700 mb-4">{sermon.description}</p>
                  )}
                  
                  {sermon.audio_url && (
                    <div className="mt-4">
                      <audio controls className="w-full">
                        <source src={sermon.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  
                  {sermon.video_url && (
                    <div className="mt-4">
                      <a 
                        href={sermon.video_url} 
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
            <p className="text-gray-500 text-lg">No sermons available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new sermons!</p>
          </div>
        )}
      </section>
    </main>
  );
} 