import React, { useState, useEffect } from 'react';

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/ministry-placeholder.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /uploads/, prefix with backend URL
  if (imagePath.startsWith('/uploads/')) {
    return `http://localhost:5000${imagePath}`;
  }
  
  // If it's just a filename, assume it's in uploads
  if (!imagePath.startsWith('/')) {
    return `http://localhost:5000/uploads/${imagePath}`;
  }
  
  // For any other relative path, prefix with backend URL
  return `http://localhost:5000${imagePath}`;
};

const Ministries = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    image: '',
    leader: '',
    contact_email: '',
    contact_phone: '',
    meeting_times: '',
    is_active: true,
    order: 0
  });
  const [additionalImages, setAdditionalImages] = useState([]);
  const [imageCaptions, setImageCaptions] = useState({});

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchMinistries = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/ministries/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch ministries');
      }

      const data = await response.json();
      setMinistries(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ministries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, []);

  const handleAddMinistry = () => {
    setEditingMinistry(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      long_description: '',
      image: '',
      leader: '',
      contact_email: '',
      contact_phone: '',
      meeting_times: '',
      is_active: true,
      order: 0
    });
    setAdditionalImages([]);
    setImageCaptions({});
    setShowAddModal(true);
  };

  const handleEditMinistry = (ministry) => {
    setEditingMinistry(ministry);
    setFormData({
      name: ministry.name || '',
      slug: ministry.slug || '',
      description: ministry.description || '',
      long_description: ministry.long_description || '',
      image: ministry.image || '',
      leader: ministry.leader || '',
      contact_email: ministry.contact_email || '',
      contact_phone: ministry.contact_phone || '',
      meeting_times: ministry.meeting_times || '',
      is_active: ministry.is_active || true,
      order: ministry.order || 0
    });
    setAdditionalImages([]);
    setImageCaptions({});
    setShowAddModal(true);
  };

  const handleDeleteMinistry = async (id) => {
    if (window.confirm('Are you sure you want to delete this ministry?')) {
      try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:5000/api/ministries/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to delete ministry');
        }

        await fetchMinistries();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting ministry:', err);
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

  const handleFileChange = (e, type = 'main') => {
    if (type === 'main') {
      setFormData(prev => ({
        ...prev,
        main_image: e.target.files[0]
      }));
    } else {
      setAdditionalImages(Array.from(e.target.files));
    }
  };

  const handleCaptionChange = (index, caption) => {
    setImageCaptions(prev => ({
      ...prev,
      [index]: caption
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = getAuthToken();
      const url = editingMinistry 
        ? `http://localhost:5000/api/ministries/${editingMinistry.id}/`
        : 'http://localhost:5000/api/ministries/';
      
      const method = editingMinistry ? 'PUT' : 'POST';
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'main_image') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add main image if selected
      if (formData.main_image) {
        formDataToSend.append('main_image', formData.main_image);
      }
      
      // Add additional images
      additionalImages.forEach((file, index) => {
        formDataToSend.append('additional_images', file);
        if (imageCaptions[index]) {
          formDataToSend.append(`image_caption_${index}`, imageCaptions[index]);
        }
      });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to save ministry');
      }

      await fetchMinistries();
      
      setShowAddModal(false);
      setEditingMinistry(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        long_description: '',
        image: '',
        leader: '',
        contact_email: '',
        contact_phone: '',
        meeting_times: '',
        is_active: true,
        order: 0
      });
      setAdditionalImages([]);
      setImageCaptions({});
    } catch (err) {
      setError(err.message);
      console.error('Error saving ministry:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading ministries...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Ministries</h1>
          <p className="text-gray-600">Manage church ministries and programs.</p>
        </div>
        <button 
          onClick={handleAddMinistry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Ministry
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Ministries</p>
              <p className="text-2xl font-bold text-gray-900">{ministries.length}</p>
            </div>
            <div className="text-blue-600 text-2xl">⛪</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Active Ministries</p>
              <p className="text-2xl font-bold text-gray-900">
                {ministries.filter(m => m.is_active).length}
              </p>
            </div>
            <div className="text-green-600 text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Ministry Leaders</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(ministries.map(m => m.leader)).size}
              </p>
            </div>
            <div className="text-purple-600 text-2xl">👥</div>
          </div>
        </div>
      </div>

      {/* Ministries Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Ministries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ministry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leader
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meeting Times
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
              {ministries.map((ministry) => (
                <tr key={ministry.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-lg object-cover" 
                          src={getImageUrl(ministry.image)} 
                          alt={ministry.name}
                          onError={(e) => {
                            e.target.src = '/images/ministry-placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{ministry.name}</div>
                        <div className="text-sm text-gray-500">{ministry.description}</div>
                        {ministry.images && ministry.images.length > 0 && (
                          <div className="text-xs text-gray-400">
                            {ministry.images.length} additional image{ministry.images.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ministry.leader}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{ministry.contact_email}</div>
                      <div>{ministry.contact_phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ministry.meeting_times}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      ministry.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ministry.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditMinistry(ministry)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteMinistry(ministry.id)}
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingMinistry ? 'Edit Ministry' : 'Add New Ministry'}
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
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Long Description</label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Main Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Main Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'main')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img src={getImageUrl(formData.image)} alt="Current main image" className="h-20 w-20 object-cover rounded" />
                  </div>
                )}
              </div>

              {/* Additional Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Images (Max 8)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, 'additional')}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {additionalImages.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {additionalImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Additional image ${index + 1}`} 
                          className="h-20 w-20 object-cover rounded"
                        />
                        <input
                          type="text"
                          placeholder="Caption"
                          value={imageCaptions[index] || ''}
                          onChange={(e) => handleCaptionChange(index, e.target.value)}
                          className="mt-1 block w-full text-xs border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leader</label>
                  <input
                    type="text"
                    name="leader"
                    value={formData.leader}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Meeting Times</label>
                  <input
                    type="text"
                    name="meeting_times"
                    value={formData.meeting_times}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
                    <span className="ml-2 text-sm text-gray-700">Active ministry</span>
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
                  {editingMinistry ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ministries; 