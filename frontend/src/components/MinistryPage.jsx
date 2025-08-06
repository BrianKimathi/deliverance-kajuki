import React from 'react';
import { useMinistries, useMinistryCards, useMinistryImages } from '../hooks/useApi';
import { getImageUrl } from '../utils/imageUtils';

const logoColor = '#01477E';

export default function MinistryPage({ ministrySlug, fallbackName = 'Ministry' }) {
  const { data: ministries, loading: ministriesLoading, error: ministriesError } = useMinistries();
  const { data: cards, loading: cardsLoading, error: cardsError } = useMinistryCards(ministrySlug);
  const { data: images, loading: imagesLoading, error: imagesError } = useMinistryImages(ministrySlug);

  // Find the ministry by slug
  const ministry = ministries?.find(m => m.slug === ministrySlug) || {
    name: fallbackName,
    description: 'Ministry description not available.',
    long_description: 'Detailed ministry information will be available soon.'
  };

  // Loading state
  if (ministriesLoading || cardsLoading || imagesLoading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ministry information...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (ministriesError || cardsError || imagesError) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">Error loading ministry information. Please try again later.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center" style={{ color: logoColor }}>{ministry.name}</h1>
        <p className="text-base text-gray-600 text-center mb-4">{ministry.description}</p>
        {ministry.image && (
          <img src={getImageUrl(ministry.image)} alt={ministry.name} className="w-full h-72 object-cover rounded-xl mb-6" />
        )}
        <p className="text-lg text-gray-700 mb-8 text-center">{ministry.long_description}</p>
        
        {cards && cards.length > 0 && (
          <div className="space-y-6 mb-10">
            {cards.map(card => (
              <div key={card.id} className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center md:items-stretch overflow-hidden">
                {card.image && (
                  <div className="md:w-1/3">
                    <img src={getImageUrl(card.image)} alt={card.title} className="w-full h-48 md:h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: logoColor }}>{card.title}</h3>
                  <p className="text-gray-700">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {images && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {images.map((img) => (
              <div key={img.id} className="relative">
                <img 
                  src={getImageUrl(img.image_url)} 
                  alt={img.caption || 'Ministry Image'} 
                  className="w-full h-40 object-cover rounded-lg"
                />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm rounded-b-lg">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
} 