import React from 'react';
import { Link } from 'react-router-dom';
import { useResources } from '../hooks/useApi';

export default function Resources() {
  const { data: resources, loading, error } = useResources();

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-red-600">Error loading resources: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-blue-900">Resources</h1>
        <p className="text-lg text-center text-gray-700 mb-8">Discover helpful resources to support your spiritual journey and personal growth.</p>
        
        {resources && resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-lg flex flex-col items-center p-6 hover:bg-blue-50 transition hover:shadow-xl">
                {resource.image && (
                  <img 
                    src={resource.image} 
                    alt={resource.title} 
                    className="w-20 h-20 object-cover rounded-full mb-4 border-4 border-white shadow"
                  />
                )}
                <h2 className="text-xl font-bold mb-2 text-center text-blue-900">{resource.title}</h2>
                <p className="text-gray-700 text-base text-center mb-4">{resource.description}</p>
                {resource.category && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-4">
                    {resource.category}
                  </span>
                )}
                {resource.file_url && (
                  <a 
                    href={resource.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-700 font-bold mt-auto hover:text-blue-900"
                  >
                    Download Resource →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No resources available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for new resources!</p>
          </div>
        )}
      </section>
    </main>
  );
} 