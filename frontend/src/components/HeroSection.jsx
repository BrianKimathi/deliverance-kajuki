import React, { useEffect, useState } from 'react';
import { useHeroSlides } from '../hooks/useApi';
import { getImageUrl } from '../utils/imageUtils';
import logo from '../assets/dciu-logo.png';

const HeroSection = () => {
  const { data: heroSlides, loading } = useHeroSlides();
  const [current, setCurrent] = useState(0);

  // Default slides if no data from API
  const defaultSlides = [
    {
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full text-white">
          <img src={logo} alt="Logo" className="w-24 h-24 mb-4 drop-shadow-xl bg-white rounded-full p-2" />
          <span className="text-lg md:text-2xl font-semibold mb-1 drop-shadow-xl">Welcome to</span>
          <span className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-xl" style={{ color: '#00b4d8' }}>Deliverance church Int'l - Kajuki</span>
          <span className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-xl text-white">The Center For Transformation</span>
          <div className="w-24 h-1 bg-white/70 rounded-full mb-4"></div>
          <span className="text-lg md:text-2xl font-medium mb-2 drop-shadow-xl text-white text-center">Rejoice in the Lord always. I will say it again: Rejoice</span>
          <span className="italic text-base md:text-lg text-gray-200 drop-shadow-xl">Philippians 4:4</span>
        </div>
      ),
    },
    {
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full text-white">
          <span className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-xl">Join Our Community</span>
          <span className="text-lg md:text-2xl font-medium mb-2 drop-shadow-xl text-white text-center">Experience worship, fellowship, and growth together.</span>
        </div>
      ),
    },
    {
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80',
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full text-white">
          <span className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-xl" style={{ color: '#00b4d8' }}>DCI - Kajuki Ministries</span>
          <span className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-xl text-white">A place to worship and connect with God</span>
          <div className="h-0.5 w-2/3 md:w-1/2 bg-white/80 rounded-full mb-4"></div>
          <span className="text-lg md:text-md font-medium mb-6 drop-shadow-xl text-white text-center">Our ministries and worship experiences are designed to help you grow in faith, find community, and encounter God in a powerful way. Join us as we celebrate, serve, and transform lives together.</span>
          <button className="mt-2 px-8 py-3 rounded-full border-2 border-cyan-500 text-cyan-100 font-bold text-lg shadow-lg hover:bg-cyan-500/10 hover:text-white transition-colors duration-200">Join A Ministry Today</button>
        </div>
      ),
    },
  ];

  // Transform API data to match the expected format
  const transformApiSlides = (apiSlides) => {
    return apiSlides.map(slide => ({
      image: slide.image_url ? getImageUrl(slide.image_url) : null,
      id: slide.id,
      title: slide.title,
      subtitle: slide.subtitle
    }));
  };

  // Use API data if available and has images, otherwise use default slides
  const slides = heroSlides && heroSlides.length > 0 
    ? transformApiSlides(heroSlides).filter(slide => slide.image) 
    : defaultSlides;

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  if (loading) {
    return (
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden p-0 m-0">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-0">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  // If we have API slides with images, show background images with content
  if (heroSlides && heroSlides.length > 0 && slides.length > 0) {
    return (
      <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden p-0 m-0">
        <img
          src={slides[current]?.image}
          alt="Hero Slide"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-90"
          style={{ zIndex: 1 }}
        />
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-0">
          <div className="flex flex-col items-center justify-center w-full h-full text-white">
            <span className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-xl" style={{ color: '#00b4d8' }}>
              {slides[current]?.title || 'DCI - Kajuki Ministries'}
            </span>
            <span className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-xl text-white">
              {slides[current]?.subtitle || 'A place to worship and connect with God'}
            </span>
            <div className="h-0.5 w-2/3 md:w-1/2 bg-white/80 rounded-full mb-4"></div>
            <span className="text-lg md:text-md font-medium mb-6 drop-shadow-xl text-white text-center">
              Our ministries and worship experiences are designed to help you grow in faith, find community, and encounter God in a powerful way.
            </span>
            <button className="mt-2 px-8 py-3 rounded-full border-2 border-cyan-500 text-cyan-100 font-bold text-lg shadow-lg hover:bg-cyan-500/10 hover:text-white transition-colors duration-200">
              Join A Ministry Today
            </button>
          </div>
        </div>
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {slides.map((_, idx) => (
              <span 
                key={idx} 
                className={`w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-gray-400'} inline-block transition-all duration-300`}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  // Fallback to default slides with content
  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden p-0 m-0">
      <img
        src={slides[current]?.image || slides[0]?.image}
        alt="Hero Slide"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-80"
        style={{ zIndex: 1 }}
      />
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full py-0">
        {slides[current]?.content || slides[0]?.content}
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, idx) => (
            <span 
              key={idx} 
              className={`w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-gray-400'} inline-block transition-all duration-300`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection; 