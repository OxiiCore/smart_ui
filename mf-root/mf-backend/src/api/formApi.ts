import express, { Router } from 'express';
import { z } from 'zod';
import { db } from '../services/db';
import { forms, fields, insertFormSchema, insertFieldSchema } from '../models/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Get all forms
router.get('/', async (req, res) => {
  try {
    const allForms = await db.select().from(forms);
    res.json(allForms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Get form by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [form] = await db.select().from(forms).where(eq(forms.id, id));
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    // Get form fields
    const formFields = await db.select().from(fields).where(eq(fields.formId, id));
    
    res.json({ ...form, fields: formFields });
  } catch (error) {
    console.error(`Error fetching form with id ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// Create new form
router.post('/', async (req, res) => {
  try {
    const formData = insertFormSchema.parse(req.body);
    
    const [newForm] = await db.insert(forms).values(formData).returning();
    
    res.status(201).json(newForm);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Add field to form
router.post('/:formId/fields', async (req, res) => {
  const { formId } = req.params;
  
  try {
    // Check if form exists
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    const fieldData = insertFieldSchema.parse({ ...req.body, formId });
    
    const [newField] = await db.insert(fields).values(fieldData).returning();
    
    res.status(201).json(newField);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    
    console.error(`Error adding field to form ${formId}:`, error);
    res.status(500).json({ error: 'Failed to add field to form' });
  }
});

// Update form
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [existingForm] = await db.select().from(forms).where(eq(forms.id, id));
    
    if (!existingForm) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    const formData = insertFormSchema.partial().parse(req.body);
    
    const [updatedForm] = await db
      .update(forms)
      .set(formData)
      .where(eq(forms.id, id))
      .returning();
    
    res.json(updatedForm);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    
    console.error(`Error updating form ${id}:`, error);
    res.status(500).json({ error: 'Failed to update form' });
  }
});

export default router;