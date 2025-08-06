import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await apiService.getFormSubmissions();
      setSubmissions(response);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = async (submission) => {
    try {
      const response = await apiService.getFormSubmission(submission.id);
      setSelectedSubmission(response);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching submission details:', error);
    }
  };

  const handleMarkAsRead = async (submissionId) => {
    try {
      await apiService.markSubmissionAsRead(submissionId);
      fetchSubmissions(); // Refresh the list
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await apiService.deleteFormSubmission(submissionId);
      fetchSubmissions(); // Refresh the list
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const getFormTypeLabel = (formType) => {
    const labels = {
      'contact': 'Contact Form',
      'prayer_request': 'Prayer Request',
      'pastoral_care': 'Pastoral Care',
      'crisis_counselling': 'Crisis Counselling',
      'baby_dedication': 'Baby Dedication',
      'pre_marital': 'Pre-Marital Counselling'
    };
    return labels[formType] || formType;
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Form Submissions</h1>
        <div className="text-sm text-gray-500">
          {submissions.filter(s => !s.is_read).length} unread
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            All Submissions ({submissions.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {submissions.map((submission) => (
            <div key={submission.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${submission.is_read ? 'bg-gray-300' : 'bg-red-500'}`}></div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {submission.name || 'Anonymous'}
                  </h3>
                  <p className="text-sm text-gray-500">{submission.email}</p>
                  <p className="text-xs text-gray-400">
                    {getFormTypeLabel(submission.form_type)} • {formatDate(submission.timestamp)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {submission.message?.substring(0, 100)}...
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewSubmission(submission)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View
                </button>
                {!submission.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(submission.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDeleteSubmission(submission.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {submissions.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              No submissions found.
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing submission details */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">
                {getFormTypeLabel(selectedSubmission.form_type)} Submission
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSubmission.name || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSubmission.email || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{selectedSubmission.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
              
              {selectedSubmission.additional_data && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Additional Data</label>
                  <pre className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                    {JSON.stringify(selectedSubmission.additional_data, null, 2)}
                  </pre>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Submitted</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedSubmission.timestamp)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedSubmission.is_read ? 'Read' : 'Unread'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4">
              {!selectedSubmission.is_read && (
                <button
                  onClick={() => {
                    handleMarkAsRead(selectedSubmission.id);
                    setShowModal(false);
                  }}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 