const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Announcements
  async getAnnouncements() {
    return this.request('/announcements/');
  }

  async getAnnouncement(id) {
    return this.request(`/announcements/${id}`);
  }

  // Events
  async getEvents() {
    return this.request('/events/');
  }

  async getEvent(id) {
    return this.request(`/events/${id}`);
  }

  // Ministries
  async getMinistries() {
    return this.request('/ministries/');
  }

  async getMinistry(slug) {
    return this.request(`/ministries/${slug}`);
  }

  async getMinistryCards(slug) {
    return this.request(`/ministries/${slug}/cards`);
  }

  async getMinistryImages(slug) {
    return this.request(`/ministries/${slug}/images`);
  }

  // Pastors
  async getPastors() {
    return this.request('/pastors/');
  }

  async getPastor(id) {
    return this.request(`/pastors/${id}`);
  }

  // Church Info
  async getChurchInfo() {
    return this.request('/church-info/');
  }

  // Services
  async getServices() {
    return this.request('/services/');
  }

  // Sermons
  async getSermons() {
    return this.request('/sermons/');
  }

  async getSermon(id) {
    return this.request(`/sermons/${id}`);
  }

  // Devotionals
  async getDevotionals() {
    return this.request('/devotionals/');
  }

  async getDevotional(id) {
    return this.request(`/devotionals/${id}`);
  }

  // Resources
  async getResources() {
    return this.request('/resources/');
  }

  // Hero Slides
  async getHeroSlides() {
    return this.request('/hero-slides/');
  }

  // Contact form submission
  async submitContactForm(formData) {
    return this.request('/contact/', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  // Giving
  async getGivingInfo() {
    return this.request('/giving/');
  }

  async submitGivingTransaction(transactionData) {
    return this.request('/giving-transactions/', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  // Subscriptions
  async subscribe(email, name = '') {
    return this.request('/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  }

  async unsubscribe(email) {
    return this.request('/subscriptions/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export default new ApiService(); 