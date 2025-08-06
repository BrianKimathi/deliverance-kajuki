import React from 'react';
const logoColor = '#01477E';
const ministry = {
  name: 'Widows and Orphans Ministry',
  desc: 'Extending Christ’s love and practical support to widows and orphans.',
  img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  longDesc: 'This ministry extends Christ’s love and practical support to widows and orphans, providing care, encouragement, and resources to help them thrive within our church family.'
};
const cards = [
  {
    title: 'Support',
    desc: 'Offering practical and emotional support to widows and orphans through regular visits, counseling, and assistance.'
  },
  {
    title: 'Encouragement',
    desc: 'Creating a loving community where widows and orphans are encouraged, valued, and empowered.'
  },
  {
    title: 'Resources',
    desc: 'Connecting families with resources and opportunities for growth, education, and well-being.'
  }
];
const gallery = [
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80'
];
export default function Widows() {
  return (
    <main className="bg-gray-50 min-h-screen py-12 px-4">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center" style={{ color: logoColor }}>{ministry.name}</h1>
        <p className="text-base text-gray-600 text-center mb-4">{ministry.desc}</p>
        <img src={ministry.img} alt={ministry.name} className="w-full h-72 object-cover rounded-xl mb-6" />
        <p className="text-lg text-gray-700 mb-8 text-center">{ministry.longDesc}</p>
        <div className="space-y-6 mb-10">
          {cards.map(card => (
            <div key={card.title} className="bg-white rounded-xl shadow flex flex-col md:flex-row items-center md:items-stretch overflow-hidden">
              <div className="flex-1 p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: logoColor }}>{card.title}</h3>
                <p className="text-gray-700">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {gallery.map((img, i) => (
            <img key={i} src={img} alt="Widows Ministry" className="w-full h-40 object-cover rounded-lg" />
          ))}
        </div>
      </section>
    </main>
  );
} 