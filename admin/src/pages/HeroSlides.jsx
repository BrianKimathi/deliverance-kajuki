import React, { useState, useEffect } from 'react';

const HeroSlides = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: null,
    imageUrl: '',
    order_num: '',
    is_active: true
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch slides from API
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/hero-slides/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        console.error('Authentication failed - token may be expired');
        // Redirect to login or refresh token
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      } else {
        console.error('Failed to fetch slides:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = () => {
    setShowAddModal(true);
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      image: null,
      imageUrl: '',
      order_num: '',
      is_active: true
    });
    setImagePreview(null);
  };

  const handleEditSlide = (slide) => {
    setEditingSlide(slide);
    setShowAddModal(true);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image: null,
      imageUrl: slide.image_url || '',
      order_num: slide.order_num.toString(),
      is_active: slide.is_active
    });
    setImagePreview(slide.image_url ? `http://localhost:5000${slide.image_url}` : null);
  };

  const handleDeleteSlide = async (id) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/hero-slides/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          fetchSlides();
        } else {
          console.error('Failed to delete slide:', response.status);
        }
      } catch (error) {
        console.error('Error deleting slide:', error);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imageUrl: ''
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('order_num', formData.order_num);
      formDataToSend.append('is_active', formData.is_active.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      } else if (formData.imageUrl) {
        formDataToSend.append('image', formData.imageUrl);
      }

      const url = editingSlide 
        ? `http://localhost:5000/api/hero-slides/${editingSlide.id}`
        : 'http://localhost:5000/api/hero-slides/';
      
      const method = editingSlide ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingSlide(null);
        setFormData({
          title: '',
          subtitle: '',
          image: null,
          imageUrl: '',
          order_num: '',
          is_active: true
        });
        setImagePreview(null);
        fetchSlides();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.msg || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Error saving slide. Please try again.');
    } finally {
      setUploading(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-600">Manage homepage hero slides and banners.</p>
        </div>
        <button 
          onClick={handleAddSlide}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Slide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              {slide.image_url ? (
                <img 
                  src={`http://localhost:5000${slide.image_url}`} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{slide.title}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  slide.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {slide.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{slide.subtitle}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📊</span>
                  Order: {slide.order_num}
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditSlide(slide)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingSlide ? 'Edit Slide' : 'Add New Slide'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Order</label>
                  <input
                    type="number"
                    name="order_num"
                    value={formData.order_num}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="is_active"
                    value={formData.is_active}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload a new image or use URL below</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Or Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="border border-gray-300 rounded-md p-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-48 object-cover rounded"
                    />
                  </div>
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
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : (editingSlide ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSlides; 