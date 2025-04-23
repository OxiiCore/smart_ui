import { api } from 'shared/lib/api-client';

// Fetch home data from API
export async function fetchHomeData() {
  try {
    const response = await api.get('/api/home/stats');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch home data:', error);
    throw error;
  }
}
