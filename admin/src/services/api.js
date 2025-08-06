const API_BASE_URL = 'http://localhost:5000/api';

// Utility function to clear old tokens
export const clearOldTokens = () => {
  localStorage.removeItem('token'); // Remove old token key
  localStorage.removeItem('authToken'); // Remove current token key
  console.log('🔧 DEBUG: Cleared all tokens from localStorage');
};

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    console.log('🔍 DEBUG: API Request Details:');
    console.log('🔍 DEBUG: URL:', url);
    console.log('🔍 DEBUG: Token:', token ? 'Present' : 'Missing');
    console.log('🔍 DEBUG: Token preview:', token ? `${token.substring(0, 20)}...` : 'None');
    console.log('🔍 DEBUG: Options:', options);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('🔍 DEBUG: Final config:', config);

    try {
      const response = await fetch(url, config);
      console.log('🔍 DEBUG: Response status:', response.status);
      console.log('🔍 DEBUG: Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('🔍 DEBUG: Error response body:', errorText);
        
        // Handle token expiration
        if (response.status === 422 && errorText.includes('Signature verification failed')) {
          console.log('🔍 DEBUG: Token expired, redirecting to login');
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          throw new Error('Token expired. Please login again.');
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Ministries
  async getMinistries() {
    return this.request('/ministries/');
  }

  async getMinistry(slug) {
    return this.request(`/ministries/${slug}`);
  }

  async createMinistry(data) {
    return this.request('/ministries/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateMinistry(id, data) {
    return this.request(`/ministries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteMinistry(id) {
    return this.request(`/ministries/${id}`, {
      method: 'DELETE'
    });
  }

  // Ministry Cards
  async getMinistryCards(slug) {
    return this.request(`/ministries/${slug}/cards`);
  }

  async createMinistryCard(slug, data) {
    return this.request(`/ministries/${slug}/cards`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateMinistryCard(slug, cardId, data) {
    return this.request(`/ministries/${slug}/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteMinistryCard(slug, cardId) {
    return this.request(`/ministries/${slug}/cards/${cardId}`, {
      method: 'DELETE'
    });
  }

  // Ministry Images
  async getMinistryImages(slug) {
    return this.request(`/ministries/${slug}/images`);
  }

  async addMinistryImage(slug, formData) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}/ministries/${slug}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async deleteMinistryImage(slug, imageId) {
    return this.request(`/ministries/${slug}/images/${imageId}`, {
      method: 'DELETE'
    });
  }

  // Upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Contact Form Submissions
  async getFormSubmissions() {
    return this.request('/contact/form-submissions');
  }

  async getFormSubmission(id) {
    return this.request(`/contact/form-submissions/${id}`);
  }

  async markSubmissionAsRead(id) {
    return this.request(`/contact/form-submissions/${id}/read`, {
      method: 'PUT'
    });
  }

  async deleteFormSubmission(id) {
    return this.request(`/contact/form-submissions/${id}`, {
      method: 'DELETE'
    });
  }

  // Subscriptions
  async getSubscriptions() {
    return this.request('/subscriptions/subscriptions');
  }

  async deleteSubscription(id) {
    return this.request(`/subscriptions/subscriptions/${id}`, {
      method: 'DELETE'
    });
  }

  // Giving Methods
  async getGivingMethods() {
    return this.request('/giving/admin');
  }

  async createGivingMethod(data) {
    return this.request('/giving/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateGivingMethod(id, data) {
    return this.request(`/giving/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteGivingMethod(id) {
    return this.request(`/giving/${id}`, {
      method: 'DELETE'
    });
  }

  // Giving Transactions
  async getGivingTransactions() {
    return this.request('/giving-transactions/');
  }

  async createGivingTransaction(data) {
    return this.request('/giving-transactions/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateGivingTransaction(id, data) {
    return this.request(`/giving-transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteGivingTransaction(id) {
    return this.request(`/giving-transactions/${id}`, {
      method: 'DELETE'
    });
  }

  // Church Members
  async getChurchMembers(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString();
    const url = queryString ? `/church-members/?${queryString}` : '/church-members/';
    return this.request(url);
  }

  async getChurchMember(id) {
    return this.request(`/church-members/${id}`);
  }

  async createChurchMember(data) {
    return this.request('/church-members/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateChurchMember(id, data) {
    return this.request(`/church-members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteChurchMember(id) {
    return this.request(`/church-members/${id}`, {
      method: 'DELETE'
    });
  }

  async assignMinistry(memberId, data) {
    return this.request(`/church-members/${memberId}/ministries`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async removeMinistryAssignment(memberId, assignmentId) {
    return this.request(`/church-members/${memberId}/ministries/${assignmentId}`, {
      method: 'DELETE'
    });
  }

  async exportMembersPDF(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const queryString = params.toString();
    const url = queryString ? `/church-members/export-pdf?${queryString}` : '/church-members/export-pdf';
    
    // For file downloads, we need to handle the response differently
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `church_members_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  }
}

export default new ApiService(); 