import React from 'react';
import { useChurchInfo } from '../hooks/useApi';

export default function About() {
  const { data: churchInfo, loading, error } = useChurchInfo();

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading church information...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">Error loading church information: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-blue-900">About Us</h1>
        
        {churchInfo ? (
          <div className="space-y-8">
            {churchInfo.about && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Story</h2>
                <p className="text-gray-700 leading-relaxed">{churchInfo.about}</p>
              </div>
            )}
            
            {churchInfo.vision && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Vision</h2>
                <p className="text-gray-700 leading-relaxed">{churchInfo.vision}</p>
              </div>
            )}
            
            {churchInfo.mission && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">{churchInfo.mission}</p>
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Contact Information</h2>
              <div className="space-y-2 text-gray-700">
                {churchInfo.address && (
                  <p><span className="font-semibold">Address:</span> {churchInfo.address}</p>
                )}
                {churchInfo.phone && (
                  <p><span className="font-semibold">Phone:</span> {churchInfo.phone}</p>
                )}
                {churchInfo.email && (
                  <p><span className="font-semibold">Email:</span> {churchInfo.email}</p>
                )}
                {churchInfo.website && (
                  <p><span className="font-semibold">Website:</span> {churchInfo.website}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg">Church information not available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later!</p>
          </div>
        )}
      </section>
    </main>
  );
} 