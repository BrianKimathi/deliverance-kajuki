import React from 'react';
const logoColor = '#01477E';
const ministry = {
  name: 'Daughters of Faith (Women)',
  desc: 'Equipping women to reach their full potential in Christ.',
  img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  longDesc: 'Daughters of Faith inspires and supports women to grow in faith, build meaningful relationships, and serve others, offering Bible studies, events, and opportunities for personal development.'
};
const cards = [
  {
    title: 'Bible Study',
    desc: 'Weekly Bible study sessions to deepen faith and understanding of God’s word.'
  },
  {
    title: 'Fellowship',
    desc: 'Opportunities for women to connect, share, and encourage one another in a supportive environment.'
  },
  {
    title: 'Service',
    desc: 'Serving the church and community through outreach, support, and special projects.'
  }
];
const gallery = [
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80'
];
export default function Women() {
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
            <img key={i} src={img} alt="Women Ministry" className="w-full h-40 object-cover rounded-lg" />
          ))}
        </div>
      </section>
    </main>
  );
} 