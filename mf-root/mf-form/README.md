# Micro Frontend: mf-form

## Description
This module handles all form-related UI and logic, exposed via Module Federation.

## Development
```bash
npm install
npm run dev
```
Access it via http://localhost:3003

## Exposed Module
- ./FormPage

## Input Props
- formId: string
- defaultValues?: object
- onSubmit?: (data) => void