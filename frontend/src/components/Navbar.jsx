import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import dciuLogo from '../assets/dciu-logo.png';

const navLinks = [
  { label: 'Home', to: '/' },
  {
    label: 'About Us',
    dropdown: [
      { label: 'Pastors', to: '/about/pastors' },
      { label: 'Vision', to: '/about/vision' },
    ],
  },
  // Ministries is now a direct link
  { label: 'Ministries', to: '/ministries' },
  {
    label: 'Media',
    dropdown: [
      { label: 'Sermons', to: '/media/sermons' },
      { label: 'Announcements', to: '/media/announcements' },
      { label: 'Devotionals', to: '/media/devotionals' },
    ],
  },
  { label: 'Events', to: '/events' },
  { label: 'Contact', to: '/contact' },
  { label: 'Giving', to: '/giving' },
];

const ChevronDownIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const dropdownRefs = useRef([]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRefs.current.every(ref => ref && !ref.contains(event.target))
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg border-b-2 border-gray-300 rounded-b-xl">
      <div className="w-full flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center md:gap-3 gap-1 text-black font-extrabold text-xl tracking-tight pl-4 md:pl-8 flex-1 md:flex-none">
          <span className="inline-block w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            <img src={dciuLogo} alt="Logo" className="w-8 h-8 object-contain" />
          </span>
          <span className="flex flex-col items-start md:ml-2 ml-1 text-left">
            <span className="font-bold text-base sm:text-lg md:text-base" style={{ color: '#01477E' }}>Deliverance church Int'l - Kajuki</span>
            <span className="font-normal text-gray-600 text-sm sm:text-base md:text-sm -mt-1 md:mt-0">A center of transformation.</span>
          </span>
        </Link>
        <nav className="hidden md:flex gap-2 items-center h-full pr-4 md:pr-8">
          {navLinks.map((link, idx) =>
            link.dropdown ? (
              <div
                key={link.label}
                className="relative group h-full"
                style={{ display: 'inline-block' }}
                ref={el => (dropdownRefs.current[idx] = el)}
              >
                <button
                  className={`flex items-center px-4 py-2 h-full font-semibold transition text-black hover:bg-gray-100 rounded ${openDropdown === idx ? 'bg-gray-100' : ''}`}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === idx}
                  onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                >
                  {link.label}
                  <ChevronDownIcon className="transition-transform duration-200 text-gray-700" style={{ transform: openDropdown === idx ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                {openDropdown === idx && (
                  <div
                    className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-30 animate-fade-in border border-gray-200"
                  >
                    {link.dropdown.map((sublink) => (
                      <Link
                        key={sublink.to}
                        to={sublink.to}
                        className={`block px-5 py-2 text-gray-800 hover:bg-gray-100 hover:text-black font-medium transition ${location.pathname === sublink.to ? 'bg-gray-100 text-black' : ''}`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 font-semibold text-black hover:bg-gray-100 rounded transition ${location.pathname === link.to ? 'bg-gray-100' : ''}`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
        <button
          className="md:hidden flex items-center text-black hover:text-gray-700 focus:outline-none pr-4"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-fade-in">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link, idx) =>
              link.dropdown ? (
                <div key={link.label} className="mb-2">
                  <button className="flex items-center w-full font-semibold text-black py-2" onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}>
                    {link.label}
                    <ChevronDownIcon className={`ml-1 transition-transform duration-200 text-gray-700 ${openDropdown === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === idx && (
                    <div className="pl-4 flex flex-col gap-1 bg-gray-100 rounded-lg mt-1">
                      {link.dropdown.map((sublink) => (
                        <Link
                          key={sublink.to}
                          to={sublink.to}
                          className="text-gray-800 hover:text-black py-1 px-2 rounded transition"
                          onClick={() => { setMobileOpen(false); setOpenDropdown(null); }}
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-semibold text-black py-2 px-2 rounded hover:bg-gray-100 transition"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar; 