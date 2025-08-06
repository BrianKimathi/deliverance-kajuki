import React, { useState, useEffect } from 'react';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    file_url: '',
    is_paid: false,
    price: 0,
    status: 'published'
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchResources = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/resources/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to fetch resources');
      }

      const data = await response.json();
      setResources(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAddResource = () => {
    setShowAddModal(true);
    setEditingResource(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      file_url: '',
      is_paid: false,
      price: 0,
      status: 'published'
    });
    setSelectedFile(null);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowAddModal(true);
    setFormData({
      title: resource.title || '',
      category: resource.category || '',
      description: resource.description || '',
      file_url: resource.file_url || '',
      is_paid: resource.is_paid || false,
      price: resource.price || 0,
      status: resource.status || 'published'
    });
    setSelectedFile(null);
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        const token = getAuthToken();
        const response = await fetch(`http://localhost:5000/api/resources/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || 'Failed to delete resource');
        }

        await fetchResources();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting resource:', err);
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = getAuthToken();
      const url = editingResource 
        ? `http://localhost:5000/api/resources/${editingResource.id}/`
        : 'http://localhost:5000/api/resources/';
      
      const method = editingResource ? 'PUT' : 'POST';
      
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'file') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
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
        throw new Error(errorData.msg || 'Failed to save resource');
      }

      await fetchResources();
      
      setShowAddModal(false);
      setEditingResource(null);
      setFormData({
        title: '',
        category: '',
        description: '',
        file_url: '',
        is_paid: false,
        price: 0,
        status: 'published'
      });
      setSelectedFile(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving resource:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading resources...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600">Manage church resources and materials.</p>
        </div>
        <button 
          onClick={handleAddResource}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Resource
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-2xl font-bold text-gray-900">{resources.length}</p>
            </div>
            <div className="text-blue-600 text-2xl">📚</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Free Resources</p>
              <p className="text-2xl font-bold text-gray-900">
                {resources.filter(r => !r.is_paid).length}
              </p>
            </div>
            <div className="text-green-600 text-2xl">🆓</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Paid Resources</p>
              <p className="text-2xl font-bold text-gray-900">
                {resources.filter(r => r.is_paid).length}
              </p>
            </div>
            <div className="text-yellow-600 text-2xl">💰</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(resources.map(r => r.category)).size}
              </p>
            </div>
            <div className="text-purple-600 text-2xl">🏷️</div>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Resources</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
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
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                      <div className="text-sm text-gray-500">{resource.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resource.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      resource.is_paid 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {resource.is_paid ? `Paid - Ksh ${resource.price}` : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {resource.file_url ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">📎</span>
                        <a 
                          href={`http://localhost:5000${resource.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          View File
                        </a>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No file</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      resource.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEditResource(resource)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteResource(resource.id)}
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
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Spiritual Growth">Spiritual Growth</option>
                    <option value="Education">Education</option>
                    <option value="Ministry">Ministry</option>
                    <option value="Family">Family</option>
                    <option value="Youth">Youth</option>
                    <option value="Music">Music</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">File</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.mp4,.mov,.avi,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.file_url && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">📎</span>
                      <span className="text-sm text-gray-600">Current file:</span>
                      <a 
                        href={`http://localhost:5000${formData.file_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        {formData.file_url.split('/').pop()}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Paid/Free Toggle */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_paid"
                    checked={formData.is_paid}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Paid Resource</span>
                </label>
              </div>
              
              {formData.is_paid && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (Ksh)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required={formData.is_paid}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

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
                  {editingResource ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources; 