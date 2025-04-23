import express, { Router } from 'express';
import { z } from 'zod';
import { db } from '../services/db';
import { 
  formSubmissions, 
  forms, 
  fields, 
  insertFormSubmissionSchema 
} from '../models/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Get all submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await db.select().from(formSubmissions);
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get submissions by form ID
router.get('/form/:formId', async (req, res) => {
  const { formId } = req.params;
  
  try {
    // Check if form exists
    const [form] = await db.select().from(forms).where(eq(forms.id, formId));
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    const submissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId));
    
    res.json(submissions);
  } catch (error) {
    console.error(`Error fetching submissions for form ${formId}:`, error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get submission by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [submission] = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.id, id));
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    console.error(`Error fetching submission ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Create new submission
router.post('/', async (req, res) => {
  try {
    const submissionData = insertFormSubmissionSchema.parse(req.body);
    
    // Check if form exists
    const [form] = await db
      .select()
      .from(forms)
      .where(eq(forms.id, submissionData.formId));
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    // Create submission
    const [newSubmission] = await db
      .insert(formSubmissions)
      .values(submissionData)
      .returning();
    
    res.status(201).json(newSubmission);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    
    console.error('Error creating submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});

// Update submission
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [existingSubmission] = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.id, id));
    
    if (!existingSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    const submissionData = insertFormSubmissionSchema.partial().parse(req.body);
    
    const [updatedSubmission] = await db
      .update(formSubmissions)
      .set(submissionData)
      .where(eq(formSubmissions.id, id))
      .returning();
    
    res.json(updatedSubmission);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    
    console.error(`Error updating submission ${id}:`, error);
    res.status(500).json({ error: 'Failed to update submission' });
  }
});

export default router;