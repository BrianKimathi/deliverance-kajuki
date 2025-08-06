import React, { useState, useEffect } from 'react';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/pastor-placeholder.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /uploads/, prefix with backend URL
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:5000${imagePath}?t=${Date.now()}`;
  }
  
  // If it's just a filename, assume it's in uploads
  if (!imagePath.startsWith('/')) {
    return `http://localhost:5000/uploads/${imagePath}?t=${Date.now()}`;
  }
  
  // For any other relative path, prefix with backend URL
  return `http://localhost:5000${imagePath}?t=${Date.now()}`;
};

const Pastors = () => {
  const [pastors, setPastors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPastor, setEditingPastor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    extended_bio: '',
    email: '',
    phone: '',
    ministry_responsibilities: '',
    is_active: true,
    order: 0
  });
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchPastors = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/pastors/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch pastors');
      }

      const data = await response.json();
      setPastors(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pastors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastors();
  }, []);

  const handleAddPastor = () => {
    setShowAddModal(true);
    setEditingPastor(null);
    setFormData({
      name: '',
      title: '',
      bio: '',
      extended_bio: '',
      email: '',
      phone: '',
      ministry_responsibilities: '',
      is_active: true,
      order: 0
    });
    setSelectedPhoto(null);
  };

  const handleEditPastor = (pastor) => {
    setEditingPastor(pastor);
    setShowAddModal(true);
    setFormData({
      name: pastor.name || '',
      title: pastor.title || '',
      bio: pastor.bio || '',
      extended_bio: pastor.extended_bio || '',
      email: pastor.email || '',
      phone: pastor.phone || '',
      ministry_responsibilities: pastor.ministry_responsibilities || '',
      is_active: pastor.is_active || true,
      order: pastor.order || 0
    });
    setSelectedPhoto(null);
  };

  const handleDeletePastor = async (id) => {
    if (window.confirm('Are you sure you want to delete this pastor?')) {
      try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:5000/api/pastors/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to delete pastor');
        }

        await fetchPastors();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting pastor:', err);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoChange = (e) => {
    setSelectedPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = getAuthToken();
      const url = editingPastor 
        ? `http://localhost:5000/api/pastors/${editingPastor.id}/`
        : 'http://localhost:5000/api/pastors/';
      
      const method = editingPastor ? 'PUT' : 'POST';
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add photo if selected
      if (selectedPhoto) {
        formDataToSend.append('image', selectedPhoto);
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to save pastor');
      }

      // Force refresh the pastors list to get updated data
      await fetchPastors();
      
      setShowAddModal(false);
      setEditingPastor(null);
      setFormData({
        name: '',
        title: '',
        bio: '',
        extended_bio: '',
        email: '',
        phone: '',
        ministry_responsibilities: '',
        is_active: true,
        order: 0
      });
      setSelectedPhoto(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving pastor:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading pastors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pastors</h1>
          <p className="text-gray-600">Manage church pastors and leadership.</p>
        </div>
        <button 
          onClick={handleAddPastor}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Pastor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Pastors</p>
              <p className="text-2xl font-bold text-gray-900">{pastors.length}</p>
            </div>
            <div className="text-blue-600 text-2xl">👨‍💼</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Active Pastors</p>
              <p className="text-2xl font-bold text-gray-900">
                {pastors.filter(p => p.is_active).length}
              </p>
            </div>
            <div className="text-green-600 text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Senior Pastors</p>
              <p className="text-2xl font-bold text-gray-900">
                {pastors.filter(p => p.title && p.title.toLowerCase().includes('senior')).length}
              </p>
            </div>
            <div className="text-purple-600 text-2xl">⛪</div>
          </div>
        </div>
      </div>

      {/* Pastors Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Pastors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pastor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pastors.map((pastor) => (
                <tr key={pastor.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img 
                          className="h-12 w-12 rounded-full object-cover" 
                          src={getImageUrl(pastor.image)} 
                          alt={pastor.name}
                          onError={(e) => {
                            e.target.src = '/images/pastor-placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{pastor.name}</div>
                        <div className="text-sm text-gray-500">{pastor.bio}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pastor.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{pastor.email}</div>
                      <div>{pastor.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      pastor.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pastor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditPastor(pastor)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeletePastor(pastor.id)}
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingPastor ? 'Edit Pastor' : 'Add New Pastor'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {editingPastor && editingPastor.image && (
                  <div className="mt-2">
                    <img src={getImageUrl(editingPastor.image)} alt="Current photo" className="h-20 w-20 object-cover rounded" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Short Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Extended Bio</label>
                <textarea
                  name="extended_bio"
                  value={formData.extended_bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ministry Responsibilities</label>
                <textarea
                  name="ministry_responsibilities"
                  value={formData.ministry_responsibilities}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active pastor</span>
                  </label>
                </div>
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
                  {editingPastor ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pastors; 