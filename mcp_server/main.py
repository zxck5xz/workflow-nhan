from fastapi import FastAPI, Depends, Header, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv

from .handlers import handle_request

load_dotenv()  # load environment from .env if present

app = FastAPI(title="MCP Server", version="0.1")


class MCPRequest(BaseModel):
    input: Dict[str, Any] = {}
    metadata: Dict[str, Any] = {}


def verify_api_key(x_api_key: Optional[str] = Header(None)) -> bool:
    """Verify the incoming `X-API-Key` header against `MCP_API_KEY` env var.

    Raises 401 if not provided or invalid. If `MCP_API_KEY` is not set,
    the server will reject requests (secure-by-default).
    """
    expected = os.getenv("MCP_API_KEY")
    if not expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="MCP_API_KEY not configured on server",
        )
    if x_api_key != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API Key"
        )
    return True


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/mcp/v1/requests")
async def mcp_requests(
    req: MCPRequest, authorized: bool = Depends(verify_api_key)
):
    """Accept a minimal MCP-style request and return a response.

    This endpoint requires `X-API-Key` header matching `MCP_API_KEY`.
    """
    output = await handle_request(req.input, req.metadata)
    return {"output": output}
