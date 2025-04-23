import express, { Router } from 'express';
import { z } from 'zod';
import { db } from '../services/db';
import { 
  formSubmissions, 
  forms, 
  fields
} from '../models/schema';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();

// Get all records (submissions with form data)
router.get('/', async (req, res) => {
  try {
    const submissions = await db.select({
      id: formSubmissions.id,
      formId: formSubmissions.formId,
      data: formSubmissions.data,
      createdAt: formSubmissions.createdAt,
      updatedAt: formSubmissions.updatedAt,
      formName: forms.name,
      status: formSubmissions.status
    })
    .from(formSubmissions)
    .leftJoin(forms, eq(formSubmissions.formId, forms.id))
    .orderBy(desc(formSubmissions.createdAt));
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Get record by ID with form data
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get the submission with form details
    const [record] = await db.select({
      id: formSubmissions.id,
      formId: formSubmissions.formId,
      data: formSubmissions.data,
      createdAt: formSubmissions.createdAt,
      updatedAt: formSubmissions.updatedAt,
      formName: forms.name,
      status: formSubmissions.status
    })
    .from(formSubmissions)
    .leftJoin(forms, eq(formSubmissions.formId, forms.id))
    .where(eq(formSubmissions.id, id));
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    // Get the fields for this form
    const formFields = await db
      .select()
      .from(fields)
      .where(eq(fields.formId, record.formId));
    
    // Combine the data
    const fullRecord = {
      ...record,
      fields: formFields
    };
    
    res.json(fullRecord);
  } catch (error) {
    console.error(`Error fetching record ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch record' });
  }
});

// Update record status (e.g., for workflow transitions)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  try {
    // Check if the record exists
    const [existingRecord] = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.id, id));
    
    if (!existingRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    // Update the status
    const [updatedRecord] = await db
      .update(formSubmissions)
      .set({ status })
      .where(eq(formSubmissions.id, id))
      .returning();
    
    res.json(updatedRecord);
  } catch (error) {
    console.error(`Error updating record status for ${id}:`, error);
    res.status(500).json({ error: 'Failed to update record status' });
  }
});

// Get records by form ID
router.get('/form/:formId', async (req, res) => {
  const { formId } = req.params;
  
  try {
    // Check if form exists
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    // Get submissions for this form
    const records = await db.select({
      id: formSubmissions.id,
      formId: formSubmissions.formId,
      data: formSubmissions.data,
      createdAt: formSubmissions.createdAt,
      updatedAt: formSubmissions.updatedAt,
      formName: forms.name,
      status: formSubmissions.status
    })
    .from(formSubmissions)
    .leftJoin(forms, eq(formSubmissions.formId, forms.id))
    .where(eq(formSubmissions.formId, formId))
    .orderBy(desc(formSubmissions.createdAt));
    
    res.json(records);
  } catch (error) {
    console.error(`Error fetching records for form ${formId}:`, error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

export default router;