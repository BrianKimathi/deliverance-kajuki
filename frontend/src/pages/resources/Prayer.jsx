import React from 'react';
const logoColor = '#01477E';
export default function Prayer() {
  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6" style={{ color: logoColor }}>Prayer Requests</h1>
        <p className="text-lg text-center text-gray-700 mb-8">Let us stand with you in prayer. Submit your prayer request below.</p>
        <form className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4">
          <input placeholder="Your Name" className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" />
          <textarea placeholder="Your Prayer Request" className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none min-h-[80px]" />
          <button type="submit" className="border-2 border-blue-700 text-blue-700 rounded px-4 py-2 font-bold hover:bg-blue-700 hover:text-white transition self-end">Submit</button>
        </form>
      </section>
    </main>
  );
} 