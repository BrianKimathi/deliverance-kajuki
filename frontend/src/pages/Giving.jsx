import React from 'react';
import { useGivingInfo } from '../hooks/useApi';

export default function Giving() {
  const { data: givingInfo, loading, error } = useGivingInfo();

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading giving information...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-gray-50 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">Error loading giving information: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6 text-blue-900">Giving</h1>
        <p className="text-lg text-center text-gray-700 mb-8">Support the ministry and mission of our church through your generous giving.</p>
        
        <div className="max-w-2xl mx-auto">
          {/* Giving Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Ways to Give</h2>
            
            {givingInfo && givingInfo.length > 0 ? (
              <div className="space-y-6">
                {givingInfo.map((method, index) => (
                  <div key={method.id || index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-800 mb-2">{method.title}</h3>
                    {method.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{method.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Giving information not available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
} 