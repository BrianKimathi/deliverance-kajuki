import React from 'react';
const logoColor = '#01477E';
export default function FamilyLife() {
  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-6" style={{ color: logoColor }}>Family Life</h1>
        <p className="text-lg text-center text-gray-700 mb-8">Apply for our Baby Dedication Class below.</p>
        <form className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Baby Dedication Class Application</h2>
          <input placeholder="Father's Full Name" className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" />
          <input placeholder="Father's Phone Number" className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" />
          <input placeholder="Mother's Full Name" className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" />
          <input placeholder="Mother's Phone Number" className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" />
          <input placeholder="Child's Full Name" className="px-4 py-2 rounded bg-gray-100 text-black focus:outline-none" />
          <button type="submit" className="border-2 border-blue-700 text-blue-700 rounded px-4 py-2 font-bold hover:bg-blue-700 hover:text-white transition self-end">Submit</button>
        </form>
      </section>
    </main>
  );
} 