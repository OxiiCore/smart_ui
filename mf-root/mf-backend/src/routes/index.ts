import { Express } from 'express';
import homeRoutes from './home';
import submissionRoutes from './submissions';
import formsRoutes from './forms';
import recordsRoutes from './records';

export function registerRoutes(app: Express) {
  // Register all routes with their prefixes
  app.use('/api/home', homeRoutes);
  app.use('/api/submissions', submissionRoutes);
  app.use('/api/forms', formsRoutes);
  app.use('/api/records', recordsRoutes);
  
  return app;
}
