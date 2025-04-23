# Micro Frontend: mf-record

## Description
This module handles record viewing, workflow transitions, and mermaid diagram visualization, exposed via Module Federation.

## Development
```bash
npm install
npm run dev
```
Access it via http://localhost:3004

## Exposed Modules
- ./RecordDetailPage
- ./RecordListPage
- ./WorkflowDiagramPage

## Input Props
### RecordDetailPage
- recordId: string
- onStatusChange?: (newStatus: string) => void

### RecordListPage
- formId?: string (optional, if not provided will show all records)

### WorkflowDiagramPage
- workflowId: string