import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeAuthToken, getAuthToken, isAuthenticated } from '../utils/auth';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const fetchUserInfo = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setUserInfo(null);
        setIsLoading(false);
        return;
      }

      // Try to fetch user info from the backend first
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUserInfo({
          username: userData.username,
          email: userData.email,
          isAdmin: userData.is_admin,
          id: userData.id,
          active: userData.active,
          created_at: userData.created_at,
          last_login: userData.last_login
        });
      } else {
        // Fallback to JWT token decoding if API call fails
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const identity = payload.sub; // The identity is in the 'sub' field
          const [user_id, username, is_admin] = identity.split(':');
          setUserInfo({
            username: username || 'Admin User',
            email: `${username || 'admin'}@dciukajuki.org`,
            isAdmin: is_admin === 'True'
          });
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          setUserInfo({
            username: 'Admin User',
            email: 'admin@dciukajuki.org',
            isAdmin: true
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      // Fallback to JWT token decoding
      try {
        const token = getAuthToken();
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const identity = payload.sub;
          const [user_id, username, is_admin] = identity.split(':');
          setUserInfo({
            username: username || 'Admin User',
            email: `${username || 'admin'}@dciukajuki.org`,
            isAdmin: is_admin === 'True'
          });
        } else {
          setUserInfo({
            username: 'Admin User',
            email: 'admin@dciukajuki.org',
            isAdmin: true
          });
        }
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        setUserInfo({
          username: 'Admin User',
          email: 'admin@dciukajuki.org',
          isAdmin: true
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    
    // Listen for profile update events
    const handleProfileUpdate = () => {
      fetchUserInfo();
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Handle click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    setUserInfo(null);
    setShowProfileMenu(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    // Navigate to profile page
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    // Navigate to settings page or show settings modal
    alert('Settings functionality coming soon!');
  };

  // Don't render if not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Authentication Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs text-gray-500 hidden sm:block">Online</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">View notifications</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>

          {/* Messages */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">View messages</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-400 ring-2 ring-white"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50 p-1"
            >
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-700">
                  {isLoading ? 'Loading...' : (userInfo?.username || 'Admin User')}
                </div>
                <div className="text-xs text-gray-500">
                  {isLoading ? '...' : (userInfo?.email || 'admin@dciukajuki.org')}
                </div>
              </div>
              <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Profile Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                  Signed in as
                </div>
                <div className="px-4 py-2 text-sm font-medium text-gray-900">
                  {userInfo?.username || 'Admin User'}
                </div>
                <div className="px-4 py-1 text-xs text-gray-500">
                  {userInfo?.email || 'admin@dciukajuki.org'}
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={handleSettingsClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 