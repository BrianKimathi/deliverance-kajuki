import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Sermons', href: '/sermons', icon: '📖' },
    { name: 'Events', href: '/events', icon: '📅' },
    { name: 'Ministries', href: '/ministries', icon: '⛪' },
    { name: 'Ministry Cards', href: '/ministry-cards', icon: '🃏' },
    { name: 'Contact Submissions', href: '/contact-submissions', icon: '📧' },
    { name: 'Subscriptions', href: '/subscriptions', icon: '📬' },
    { name: 'Announcements', href: '/announcements', icon: '📢' },
    { name: 'Devotionals', href: '/devotionals', icon: '🙏' },
    { name: 'Pastors', href: '/pastors', icon: '👨‍💼' },
    { name: 'Resources', href: '/resources', icon: '📚' },
    { name: 'Services', href: '/services', icon: '⏰' },
    { name: 'Giving', href: '/giving', icon: '💰' },
    { name: 'Giving Methods', href: '/giving-methods', icon: '🏦' },
    { name: 'Contact', href: '/contact', icon: '📞' },
    { name: 'Church Info', href: '/church-info', icon: '🏛️' },
    { name: 'Hero Slides', href: '/hero-slides', icon: '🖼️' },
    { name: 'Users', href: '/users', icon: '👥' },
    { name: 'Church Members', href: '/church-members', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <div className={`bg-blue-900 text-white transition-all duration-300 flex flex-col h-full ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-blue-800 flex-shrink-0">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white">DCIU Admin</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto scrollbar-hide bg-blue-900">
        <ul className="space-y-2 px-4 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 