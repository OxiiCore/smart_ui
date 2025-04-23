import { api } from 'shared/lib/api-client';

// Get a record by ID
export async function getRecordById(id: string) {
  try {
    const response = await api.get(`/api/records/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch record with ID ${id}:`, error);
    throw error;
  }
}

// Get workflow details for a record
export async function getWorkflowDetails(recordId: string) {
  try {
    const response = await api.get(`/api/records/${recordId}/workflow`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch workflow details for record ${recordId}:`, error);
    throw error;
  }
}
