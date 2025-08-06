// Authentication utility functions

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

export const logout = () => {
  removeAuthToken();
  window.location.href = '/login';
};

// Optional: Token validation function (for future use)
export const validateToken = async () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch('http://localhost:5000/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      return true;
    } else {
      removeAuthToken();
      return false;
    }
  } catch (error) {
    console.error('Token validation failed:', error);
    removeAuthToken();
    return false;
  }
}; 