import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error('API call failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};

// Specific hooks for common API calls
export const useAnnouncements = () => {
  return useApi(() => apiService.getAnnouncements());
};

export const useEvents = () => {
  return useApi(() => apiService.getEvents());
};

export const useMinistries = () => {
  return useApi(() => apiService.getMinistries());
};

export const useMinistryCards = (slug) => {
  return useApi(() => apiService.getMinistryCards(slug), [slug]);
};

export const useMinistryImages = (slug) => {
  return useApi(() => apiService.getMinistryImages(slug), [slug]);
};

export const usePastors = () => {
  return useApi(() => apiService.getPastors());
};

export const useChurchInfo = () => {
  return useApi(() => apiService.getChurchInfo());
};

export const useServices = () => {
  return useApi(() => apiService.getServices());
};

export const useSermons = () => {
  return useApi(() => apiService.getSermons());
};

export const useDevotionals = () => {
  return useApi(() => apiService.getDevotionals());
};

export const useResources = () => {
  return useApi(() => apiService.getResources());
};

export const useHeroSlides = () => {
  return useApi(() => apiService.getHeroSlides());
};

export const useGivingInfo = () => {
  return useApi(() => apiService.getGivingInfo());
}; 