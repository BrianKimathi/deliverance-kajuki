import React from 'react';
import { useMinistries } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

export default function Ministries() {
  const { data: ministries, loading, error } = useMinistries();

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ministries...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-600">Error loading ministries: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-blue-900">Our Ministries</h1>
        <p className="text-lg text-center text-gray-700 mb-12">Discover how you can get involved and grow in your faith through our various ministries.</p>
        
        {ministries && ministries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry) => (
              <div key={ministry.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {ministry.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={getImageUrl(ministry.image)} 
                      alt={ministry.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">{ministry.name}</h3>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {ministry.description}
                  </p>
                  
                  {ministry.leader && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">Leader:</span> {ministry.leader}
                    </div>
                  )}
                  
                  {ministry.meeting_times && (
                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-semibold">Meeting Times:</span> {ministry.meeting_times}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ministry.contact_email && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Email Available
                      </span>
                    )}
                    {ministry.contact_phone && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Phone Available
                      </span>
                    )}
                  </div>
                  
                  <Link 
                    to={`/ministries/${ministry.slug}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No ministries available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for updates!</p>
          </div>
        )}
      </section>
    </main>
  );
} 