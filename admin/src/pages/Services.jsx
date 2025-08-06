import React, { useState } from 'react';

const Services = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Sunday Service',
      day: 'Sunday',
      time: '09:00 AM',
      description: 'Main worship service with preaching and music.',
      status: 'active'
    },
    {
      id: 2,
      name: 'Prayer Meeting',
      day: 'Wednesday',
      time: '07:00 PM',
      description: 'Weekly prayer meeting for the church community.',
      status: 'active'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    time: '',
    description: '',
    status: 'active'
  });

  const handleAddService = () => {
    setShowAddModal(true);
    setEditingService(null);
    setFormData({
      name: '',
      day: '',
      time: '',
      description: '',
      status: 'active'
    });
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowAddModal(true);
    setFormData({
      name: service.name,
      day: service.day,
      time: service.time,
      description: service.description,
      status: service.status
    });
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...formData }
          : service
      ));
    } else {
      // Add new service
      const newService = {
        id: Date.now(),
        ...formData
      };
      setServices([...services, newService]);
    }
    
    setShowAddModal(false);
    setEditingService(null);
    setFormData({
      name: '',
      day: '',
      time: '',
      description: '',
      status: 'active'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Manage church service schedules.</p>
        </div>
        <button 
          onClick={handleAddService}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold rounded-full">
                {service.status}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">📅</span>
                {service.day}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">⏰</span>
                {service.time}
              </div>
            </div>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleEditService(service)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteService(service.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingService ? 'Edit Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Name</label>
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
                <label className="block text-sm font-medium text-gray-700">Day</label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Day</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
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
                  rows="3"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  {editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services; 