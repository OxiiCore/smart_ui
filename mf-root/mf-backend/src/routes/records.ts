import { Router } from 'express';

const router = Router();

// Records API routes
router.get('/:id', async (req, res) => {
  try {
    // Get record by ID
    const { id } = req.params;
    res.json({ success: true, data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;
