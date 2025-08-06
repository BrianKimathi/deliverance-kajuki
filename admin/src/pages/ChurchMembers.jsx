import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const ChurchMembers = () => {
  const [members, setMembers] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showMinistryModal, setShowMinistryModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    ministry_id: '',
    gender: '',
    marital_status: '',
    is_active: ''
  });
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    gender: '',
    marital_status: '',
    baptism_date: '',
    is_active: true,
    notes: ''
  });

  const [ministryFormData, setMinistryFormData] = useState({
    ministry_id: '',
    role: ''
  });

  const fetchMembers = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const data = await apiService.getChurchMembers(currentFilters);
      setMembers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching church members:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMinistries = async () => {
    try {
      const data = await apiService.getMinistries();
      setMinistries(data);
    } catch (err) {
      console.error('Error fetching ministries:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchMinistries();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    fetchMembers(filters);
  }, [filters]);

  const handleAddMember = () => {
    setShowAddModal(true);
    setEditingMember(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      address: '',
      gender: '',
      marital_status: '',
      baptism_date: '',
      is_active: true,
      notes: ''
    });
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowAddModal(true);
    setFormData({
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      email: member.email || '',
      phone: member.phone || '',
      date_of_birth: member.date_of_birth ? member.date_of_birth.split('T')[0] : '',
      address: member.address || '',
      gender: member.gender || '',
      marital_status: member.marital_status || '',
      baptism_date: member.baptism_date ? member.baptism_date.split('T')[0] : '',
      is_active: member.is_active,
      notes: member.notes || ''
    });
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this church member?')) {
      try {
        await apiService.deleteChurchMember(id);
        await fetchMembers();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting church member:', err);
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

  const handleMinistryInputChange = (e) => {
    const { name, value } = e.target;
    setMinistryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await apiService.updateChurchMember(editingMember.id, formData);
      } else {
        await apiService.createChurchMember(formData);
      }
      setShowAddModal(false);
      await fetchMembers();
    } catch (err) {
      setError(err.message);
      console.error('Error saving church member:', err);
    }
  };

  const handleAssignMinistry = async (e) => {
    e.preventDefault();
    try {
      await apiService.assignMinistry(selectedMember.id, ministryFormData);
      setShowMinistryModal(false);
      setMinistryFormData({ ministry_id: '', role: '' });
      await fetchMembers();
    } catch (err) {
      setError(err.message);
      console.error('Error assigning ministry:', err);
    }
  };

  const openMinistryModal = (member) => {
    setSelectedMember(member);
    setShowMinistryModal(true);
    setMinistryFormData({ ministry_id: '', role: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      ministry_id: '',
      gender: '',
      marital_status: '',
      is_active: ''
    });
  };

  const handleExportPDF = async () => {
    try {
      await apiService.exportMembersPDF(filters);
    } catch (err) {
      setError(err.message);
      console.error('Error exporting PDF:', err);
    }
  };

  const handleViewMember = (member) => {
    setViewingMember(member);
    setShowViewModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Church Members</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExportPDF}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Export PDF
          </button>
          <button
            onClick={handleAddMember}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Member
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ministry</label>
            <select
              value={filters.ministry_id}
              onChange={(e) => handleFilterChange('ministry_id', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Ministries</option>
              {ministries.map((ministry) => (
                <option key={ministry.id} value={ministry.id}>
                  {ministry.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
            <select
              value={filters.marital_status}
              onChange={(e) => handleFilterChange('marital_status', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.is_active}
              onChange={(e) => handleFilterChange('is_active', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ministries
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
            {members.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {member.full_name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {member.email && <div>{member.email}</div>}
                    {member.phone && <div>{member.phone}</div>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {member.gender && <div>Gender: {member.gender}</div>}
                    {member.marital_status && <div>Status: {member.marital_status}</div>}
                    {member.membership_date && (
                      <div>Member since: {formatDate(member.membership_date)}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {member.ministry_assignments && member.ministry_assignments.length > 0 ? (
                      member.ministry_assignments.map((assignment, index) => (
                        <div key={assignment.id} className="mb-1">
                          <span className="font-medium">{assignment.ministry_name}</span>
                          {assignment.role && <span className="text-gray-500"> ({assignment.role})</span>}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">No ministries</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    member.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewMember(member)}
                    className="text-purple-600 hover:text-purple-800 mr-3"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => openMinistryModal(member)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Assign Ministry
                  </button>
                  <button 
                    onClick={() => handleEditMember(member)}
                    className="text-green-600 hover:text-green-800 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteMember(member.id)}
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

      {/* Add/Edit Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingMember ? 'Edit Church Member' : 'Add New Church Member'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Baptism Date</label>
                  <input
                    type="date"
                    name="baptism_date"
                    value={formData.baptism_date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active Member
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
                  {editingMember ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Ministry Modal */}
      {showMinistryModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Assign Ministry to {selectedMember.full_name}
            </h3>
            <form onSubmit={handleAssignMinistry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ministry</label>
                <select
                  name="ministry_id"
                  value={ministryFormData.ministry_id}
                  onChange={handleMinistryInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Ministry</option>
                  {ministries.map((ministry) => (
                    <option key={ministry.id} value={ministry.id}>
                      {ministry.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  name="role"
                  value={ministryFormData.role}
                  onChange={handleMinistryInputChange}
                  placeholder="e.g., Leader, Member, Coordinator"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMinistryModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {showViewModal && viewingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Member Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-sm text-gray-900">{viewingMember.full_name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{viewingMember.email || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="text-sm text-gray-900">{viewingMember.phone || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="text-sm text-gray-900">{viewingMember.address || 'N/A'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <p className="text-sm text-gray-900">{viewingMember.gender || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                  <p className="text-sm text-gray-900">{viewingMember.marital_status || 'N/A'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="text-sm text-gray-900">
                    {viewingMember.date_of_birth ? formatDate(viewingMember.date_of_birth) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Baptism Date</label>
                  <p className="text-sm text-gray-900">
                    {viewingMember.baptism_date ? formatDate(viewingMember.baptism_date) : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Membership Date</label>
                <p className="text-sm text-gray-900">
                  {viewingMember.membership_date ? formatDate(viewingMember.membership_date) : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ministry Assignments</label>
                <div className="mt-2">
                  {viewingMember.ministry_assignments && viewingMember.ministry_assignments.length > 0 ? (
                    viewingMember.ministry_assignments.map((assignment) => (
                      <div key={assignment.id} className="bg-gray-50 p-2 rounded mb-2">
                        <div className="font-medium">{assignment.ministry_name}</div>
                        <div className="text-sm text-gray-600">
                          Role: {assignment.role || 'Member'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Since: {assignment.start_date ? formatDate(assignment.start_date) : 'N/A'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No ministry assignments</p>
                  )}
                </div>
              </div>
              
              {viewingMember.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900">{viewingMember.notes}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  viewingMember.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {viewingMember.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChurchMembers; 