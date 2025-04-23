import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import formApi from './api/formApi';
import submissionApi from './api/submissionApi';
import recordApi from './api/recordApi';

// Create Express server
const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// API Routes
app.use('/api/form', formApi);
app.use('/api/submission', submissionApi);
app.use('/api/record', recordApi);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Server error',
    message: err.message || 'An unexpected error occurred',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend service running on port ${PORT}`);
});