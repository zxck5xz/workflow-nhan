# Minimal MCP Server

This folder contains a minimal MCP (Model Context Protocol) server scaffold implemented with FastAPI.

Quick start

1. Create and activate a Python environment (recommended):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r mcp_server/requirements.txt
```

2. Run the server with Uvicorn:

```powershell
python -m uvicorn mcp_server.main:app --reload --port 8000
```

Endpoints

- `GET /health` — health check
- `POST /mcp/v1/requests` — accepts JSON `{ "input": {...}, "metadata": {...} }` and returns a placeholder response

Authentication

- The MCP endpoints require an API key via the `X-API-Key` header.
- Set the `MCP_API_KEY` environment variable before running the server.

For local development you can create a `.env` file at the project root with:

```
MCP_API_KEY=your_api_key_here
```

Replace the handler in `mcp_server/handlers.py` with real model invocation logic when ready.
