import React from 'react';
import { usePastors } from '../../hooks/useApi';
import { getImageUrl } from '../../utils/imageUtils';

export default function Pastors() {
  const { data: pastors, loading, error } = usePastors();

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pastors...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-600">Error loading pastors: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-blue-900">Our Pastors</h1>
        <p className="text-lg text-center text-gray-700 mb-12">Meet our dedicated pastoral team who serve and lead our congregation with love and wisdom.</p>
        
        {pastors && pastors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastors.map((pastor) => (
              <div key={pastor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {pastor.image && (
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={getImageUrl(pastor.image)} 
                      alt={pastor.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">{pastor.name}</h3>
                  <p className="text-blue-700 font-semibold mb-4">{pastor.title}</p>
                  
                  {pastor.bio && (
                    <p className="text-gray-700 mb-4">{pastor.bio}</p>
                  )}
                  
                  {pastor.extended_bio && (
                    <details className="mb-4">
                      <summary className="cursor-pointer text-blue-600 font-semibold hover:text-blue-800">
                        Read More
                      </summary>
                      <p className="text-gray-700 mt-2">{pastor.extended_bio}</p>
                    </details>
                  )}
                  
                  {pastor.ministry_responsibilities && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Ministry Responsibilities:</h4>
                      <p className="text-gray-700 text-sm">{pastor.ministry_responsibilities}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {pastor.email && (
                      <a 
                        href={`mailto:${pastor.email}`}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        Email
                      </a>
                    )}
                    {pastor.phone && (
                      <a 
                        href={`tel:${pastor.phone}`}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded hover:bg-green-200 transition-colors"
                      >
                        Phone
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No pastors information available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for updates!</p>
          </div>
        )}
      </section>
    </main>
  );
} 