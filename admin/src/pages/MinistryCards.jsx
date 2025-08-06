import React, { useState, useEffect } from 'react';
import apiService, { clearOldTokens } from '../services/api';

export default function MinistryCards() {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0
  });

  useEffect(() => {
    fetchMinistries();
  }, []);

  useEffect(() => {
    if (selectedMinistry) {
      fetchCards();
    }
  }, [selectedMinistry]);

  const fetchMinistries = async () => {
    try {
      const response = await apiService.getMinistries();
      setMinistries(response);
      if (response.length > 0) {
        setSelectedMinistry(response[0].slug);
      }
    } catch (error) {
      console.error('Error fetching ministries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async () => {
    if (!selectedMinistry) return;
    
    try {
      const response = await apiService.getMinistryCards(selectedMinistry);
      setCards(response);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCard) {
        await apiService.updateMinistryCard(selectedMinistry, editingCard.id, formData);
      } else {
        await apiService.createMinistryCard(selectedMinistry, formData);
      }
      
      setShowModal(false);
      setEditingCard(null);
      setFormData({ title: '', description: '', order: 0 });
      fetchCards();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      description: card.description || '',
      order: card.order || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    
    try {
      await apiService.deleteMinistryCard(selectedMinistry, cardId);
      fetchCards();
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Ministry Cards</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              clearOldTokens();
              alert('Tokens cleared! Please login again.');
              window.location.href = '/login';
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Clear Token & Re-login
          </button>
          <button
            onClick={() => {
              setEditingCard(null);
              setFormData({ title: '', description: '', order: 0 });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Card
          </button>
        </div>
      </div>

      {/* Ministry Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Ministry
        </label>
        <select
          value={selectedMinistry}
          onChange={(e) => setSelectedMinistry(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ministries.map(ministry => (
            <option key={ministry.id} value={ministry.slug}>
              {ministry.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cards List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Cards for {ministries.find(m => m.slug === selectedMinistry)?.name || 'Ministry'}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {cards.map((card) => (
            <div key={card.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                  <p className="text-xs text-gray-400">Order: {card.order}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(card)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {cards.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              No cards found for this ministry.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCard ? 'Edit Card' : 'Add New Card'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order || ''}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  {editingCard ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 