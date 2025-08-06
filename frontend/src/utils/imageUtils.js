const BACKEND_URL = 'http://localhost:5000';

/**
 * Get the full URL for an image
 * @param {string} imagePath - The image path from the database
 * @returns {string} - The full URL for the image
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /uploads/, prefix with backend URL
  if (imagePath.startsWith('/uploads/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  // If it's just a filename, assume it's in uploads
  if (!imagePath.startsWith('/')) {
    return `${BACKEND_URL}/uploads/${imagePath}`;
  }
  
  // For any other relative path, prefix with backend URL
  return `${BACKEND_URL}${imagePath}`;
}

/**
 * Check if an image URL is valid
 * @param {string} imageUrl - The image URL to check
 * @returns {boolean} - Whether the image URL is valid
 */
export function isValidImageUrl(imageUrl) {
  if (!imageUrl) return false;
  
  // Check if it's a valid URL
  try {
    new URL(imageUrl);
    return true;
  } catch {
    return false;
  }
} 