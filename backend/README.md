# Workflow-nhan Backend

This backend provides a dedicated API server for the Task Management Dashboard frontend.

## Features

- Persistent app data storage in `backend/data/app-data.json`
- Snapshots saved in `backend/data/snapshots/`
- AI evaluation endpoint `/api/evaluate`
- PPTX generation endpoint `/api/generate-pptx`
- File open endpoint `/api/open-file`
- Health check at `/api/health`

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start the backend server:
   ```bash
   npm start
   ```

3. Run the frontend from `task-dashboard/` as usual.

## Notes

- Vite is configured to proxy `/api` requests to `http://localhost:4000`.
- The backend uses the existing Python scripts from the `ai-agents/` folder.
- Data is stored locally and can be restored from snapshots.
