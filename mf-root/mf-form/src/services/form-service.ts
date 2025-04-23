import { api } from 'shared/lib/api-client';
import { Form } from 'shared/types';

// Fetch all forms
export async function fetchForms() {
  try {
    const response = await api.get('/api/forms');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch forms:', error);
    throw error;
  }
}

// Get a form by ID
export async function getFormById(id: string) {
  try {
    const response = await api.get(`/api/forms/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch form with ID ${id}:`, error);
    throw error;
  }
}
