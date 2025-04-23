# Micro Frontend: mf-submission

## Description
This module handles form submission functionality and displays submission history, exposed via Module Federation.

## Development
```bash
npm install
npm run dev
```
Access it via http://localhost:3002

## Exposed Modules
- ./SubmissionPage
- ./SubmissionListPage

## Input Props
### SubmissionPage
- formId: string
- onSuccess?: () => void

### SubmissionListPage
- formId?: string (optional, if not provided will show all submissions)