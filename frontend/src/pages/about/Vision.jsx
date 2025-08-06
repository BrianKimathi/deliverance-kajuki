import React from 'react';
const logoColor = '#01477E';
const visionImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80';
export default function Vision() {
  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6" style={{ color: logoColor }}>Our Vision</h1>
        <img src={visionImg} alt="Vision" className="w-full h-56 object-cover rounded-xl mb-6 shadow" />
        <blockquote className="text-xl md:text-2xl font-semibold text-center text-blue-900 mb-6 bg-blue-50 rounded-lg px-6 py-4 border-l-4 border-blue-400">
          To be a Christ-centered church transforming lives and communities through worship, discipleship, and service.
        </blockquote>
        <p className="text-lg text-center text-gray-700 mb-8">
          At DCI - Kajuki, our vision is to see every person experience the love and power of Jesus Christ. We are committed to building a vibrant, welcoming community where people of all ages can grow in faith, discover their purpose, and make a difference in the world. Through passionate worship, practical teaching, and compassionate outreach, we strive to be a beacon of hope and transformation in our region and beyond.
        </p>
      </section>
    </main>
  );
} 