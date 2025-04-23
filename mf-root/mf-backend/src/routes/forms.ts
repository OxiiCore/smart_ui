import { Router } from 'express';

const router = Router();

// Forms API routes
router.get('/', async (req, res) => {
  try {
    // Get all forms
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Get form by ID
    const { id } = req.params;
    res.json({ success: true, data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;
