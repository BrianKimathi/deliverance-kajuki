import React, { useState, useEffect } from 'react';

const Giving = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [formData, setFormData] = useState({
    donor_name: '',
    amount: '',
    payment_method: '',
    purpose: '',
    reference_number: '',
    phone_number: '',
    is_anonymous: false
  });

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/giving-transactions/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch donations');
      }

      const data = await response.json();
      setDonations(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleAddDonation = () => {
    setShowAddModal(true);
    setEditingDonation(null);
    setFormData({
      donor_name: '',
      amount: '',
      purpose: '',
      payment_method: '',
      reference_number: '',
      phone_number: '',
      is_anonymous: false
    });
  };

  const handleEditDonation = (donation) => {
    setEditingDonation(donation);
    setShowAddModal(true);
    setFormData({
      donor_name: donation.donor_name,
      amount: donation.amount.toString(),
      purpose: donation.purpose,
      payment_method: donation.payment_method,
      reference_number: donation.reference_number || '',
      phone_number: donation.phone_number || '',
      is_anonymous: donation.is_anonymous
    });
  };

  const handleDeleteDonation = async (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:5000/api/giving-transactions/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to delete donation');
        }

        await fetchDonations();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting donation:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = getAuthToken();
      const url = editingDonation 
        ? `http://localhost:5000/api/giving-transactions/${editingDonation.id}/`
        : 'http://localhost:5000/api/giving-transactions/';
      
      const method = editingDonation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          donor_name: formData.donor_name,
          amount: parseFloat(formData.amount),
          payment_method: formData.payment_method,
          purpose: formData.purpose,
          reference_number: formData.reference_number,
          phone_number: formData.phone_number,
          is_anonymous: formData.is_anonymous
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to save donation');
      }

      // Refresh donations list
      await fetchDonations();
    
    setShowAddModal(false);
    setEditingDonation(null);
    setFormData({
        donor_name: '',
      amount: '',
        payment_method: '',
        purpose: '',
        reference_number: '',
        phone_number: '',
        is_anonymous: false
      });
    } catch (err) {
      setError(err.message);
      console.error('Error saving donation:', err);
    }
  };

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading donations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="text-red-600">Error: {error}</div>
          <button 
            onClick={() => {
              setError(null);
              fetchDonations();
            }}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giving</h1>
          <p className="text-gray-600">Manage donations and financial records.</p>
        </div>
        <button 
          onClick={handleAddDonation}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Donation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">Ksh {totalDonations.toLocaleString()}</p>
            </div>
            <div className="text-green-600 text-2xl">💰</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Donors</p>
              <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
            </div>
            <div className="text-blue-600 text-2xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">Ksh {totalDonations.toLocaleString()}</p>
            </div>
            <div className="text-purple-600 text-2xl">📊</div>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Donations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {donation.is_anonymous ? 'Anonymous' : donation.donor_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Ksh {donation.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.payment_method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(donation.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditDonation(donation)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteDonation(donation.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingDonation ? 'Edit Donation' : 'Add New Donation'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Donor Name</label>
                <input
                  type="text"
                  name="donor_name"
                  value={formData.donor_name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Purpose</option>
                  <option value="Tithe">Tithe</option>
                  <option value="Offering">Offering</option>
                  <option value="Building Fund">Building Fund</option>
                  <option value="Missions">Missions</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Payment Method</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reference Number</label>
                <input
                  type="text"
                  name="reference_number"
                  value={formData.reference_number}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_anonymous"
                  checked={formData.is_anonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Anonymous Donation
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {editingDonation ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Giving; 