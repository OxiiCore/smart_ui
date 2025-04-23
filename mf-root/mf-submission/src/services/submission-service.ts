import { api } from 'shared/lib/api-client';
import { FormSubmission } from 'shared/types';

// Fetch all submissions
export async function fetchSubmissions(workflowId?: string) {
  try {
    const url = workflowId 
      ? `/api/submissions?workflowId=${workflowId}`
      : '/api/submissions';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    throw error;
  }
}

// Create a new submission
export async function createSubmission(data: Partial<FormSubmission>) {
  try {
    const response = await api.post('/api/submissions', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create submission:', error);
    throw error;
  }
}

// Get a submission by ID
export async function getSubmissionById(id: string) {
  try {
    const response = await api.get(`/api/submissions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch submission with ID ${id}:`, error);
    throw error;
  }
}
