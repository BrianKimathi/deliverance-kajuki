import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../utils/auth';
import AddContentModal from '../components/AddContentModal';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recent_sermons: [],
    upcoming_events: [],
    recent_activity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState('');

  const fetchDashboardData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddContent = (contentType) => {
    setSelectedContentType(contentType);
    setShowAddContentModal(true);
  };

  const handleContentAdded = () => {
    // Refresh dashboard data after content is added
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your church website.</p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <button 
                onClick={() => setShowAddContentModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Content
              </button>
              {showAddContentModal && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <button
                    onClick={() => handleAddContent('sermon')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Add Sermon
                  </button>
                  <button
                    onClick={() => handleAddContent('event')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Add Event
                  </button>
                  <button
                    onClick={() => handleAddContent('announcement')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Add Announcement
                  </button>
                  <button
                    onClick={() => handleAddContent('devotional')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Add Devotional
                  </button>
                </div>
              )}
            </div>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Sermons */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Sermons</h2>
            </div>
            <div className="p-6">
              {dashboardData.recent_sermons.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recent_sermons.map((sermon) => (
                    <div key={sermon.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{sermon.title}</h3>
                        <p className="text-sm text-gray-600">{sermon.speaker}</p>
                        <p className="text-xs text-gray-500">{sermon.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{sermon.views} views</p>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No sermons uploaded yet.</p>
                  <button 
                    onClick={() => handleAddContent('sermon')}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Add your first sermon
                  </button>
                </div>
              )}
              <div className="mt-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all sermons →
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            </div>
            <div className="p-6">
              {dashboardData.upcoming_events.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.upcoming_events.map((event) => (
                    <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.date}</p>
                      <p className="text-xs text-gray-500">{event.attendees} attendees</p>
                      <div className="mt-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Manage</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming events.</p>
                  <button 
                    onClick={() => handleAddContent('event')}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Create an event
                  </button>
                </div>
              )}
              <div className="mt-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all events →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {dashboardData.recent_activity.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recent_activity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'sermon' ? 'bg-blue-500' :
                      activity.type === 'event' ? 'bg-green-500' :
                      activity.type === 'announcement' ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity.</p>
              </div>
            )}
          </div>
        </div>


      </div>

      <AddContentModal
        isOpen={showAddContentModal}
        onClose={() => setShowAddContentModal(false)}
        contentType={selectedContentType}
        onContentAdded={handleContentAdded}
      />
    </>
  );
};

export default Dashboard; 