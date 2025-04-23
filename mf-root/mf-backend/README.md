# Micro Frontend: mf-backend

## Description
This is the backend API service that provides data to all micro frontends.

## Development
```bash
npm install
npm run dev
```
Access it via http://localhost:3006

## API Endpoints

### Form API
- GET /api/form - Get all forms
- GET /api/form/:id - Get form by ID
- POST /api/form - Create new form
- POST /api/form/:formId/fields - Add field to form
- PATCH /api/form/:id - Update form

### Submission API
- GET /api/submission - Get all submissions
- GET /api/submission/form/:formId - Get submissions by form ID
- GET /api/submission/:id - Get submission by ID
- POST /api/submission - Create new submission
- PATCH /api/submission/:id - Update submission

### Record API
- GET /api/record - Get all records
- GET /api/record/:id - Get record by ID with form data
- PATCH /api/record/:id/status - Update record status
- GET /api/record/form/:formId - Get records by form ID