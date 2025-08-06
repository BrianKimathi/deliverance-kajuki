import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await apiService.getSubscriptions();
      setSubscriptions(response);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      await apiService.deleteSubscription(subscriptionId);
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter(s => s.is_active);
  const inactiveSubscriptions = subscriptions.filter(s => !s.is_active);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscriptions</h1>
        <div className="text-sm text-gray-500">
          {activeSubscriptions.length} active, {inactiveSubscriptions.length} inactive
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Active Subscriptions ({activeSubscriptions.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {activeSubscriptions.map((subscription) => (
            <div key={subscription.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {subscription.name || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-500">{subscription.email}</p>
                <p className="text-xs text-gray-400">
                  Subscribed: {formatDate(subscription.created_at)}
                </p>
              </div>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
                <button
                  onClick={() => handleDeleteSubscription(subscription.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {activeSubscriptions.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              No active subscriptions found.
            </div>
          )}
        </div>
      </div>

      {/* Inactive Subscriptions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Inactive Subscriptions ({inactiveSubscriptions.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {inactiveSubscriptions.map((subscription) => (
            <div key={subscription.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {subscription.name || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-500">{subscription.email}</p>
                <p className="text-xs text-gray-400">
                  Unsubscribed: {formatDate(subscription.updated_at)}
                </p>
              </div>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Inactive
                </span>
                <button
                  onClick={() => handleDeleteSubscription(subscription.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {inactiveSubscriptions.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              No inactive subscriptions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 