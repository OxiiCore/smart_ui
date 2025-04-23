# Micro Frontend Smart UI Platform

## Overview
This project is a Micro Frontend implementation of a smart UI platform that displays data from a GraphQL API. The application has been refactored from a monolithic architecture to a modular Micro Frontend architecture using Webpack Module Federation.

## Architecture
The application is split into the following micro frontends:

- **mf-shell**: The container application that loads and integrates all other micro frontends
- **mf-home**: The home/dashboard page with charts and statistics
- **mf-form**: Form-related functionality for creating and editing forms
- **mf-submission**: Form submission functionality
- **mf-record**: Record viewing, workflow transitions, and mermaid diagram visualization
- **mf-shared**: Shared components, utilities, and types
- **mf-backend**: Backend API services

## Ports
Each micro frontend runs on its own port:
- mf-shell: 3000
- mf-home: 3001
- mf-submission: 3002
- mf-form: 3003
- mf-record: 3004
- mf-shared: 3005
- mf-backend: 3006

## Getting Started
To run the entire application, you'll need to start each micro frontend individually:

```bash
# Start the backend
cd mf-backend
npm install
npm run dev

# Start the shared library
cd mf-shared
npm install
npm run dev

# Start each micro frontend
cd mf-home
npm install
npm run dev

cd mf-form
npm install
npm run dev

cd mf-submission
npm install
npm run dev

cd mf-record
npm install
npm run dev

# Start the shell application (should be started last)
cd mf-shell
npm install
npm run dev
```

Then open http://localhost:3000 to access the application.

## Development
Please refer to the README in each micro frontend directory for specific development instructions.