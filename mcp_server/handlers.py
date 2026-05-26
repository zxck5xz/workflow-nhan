import asyncio
import os
from typing import Any, Dict


async def handle_request(input_data: Dict[str, Any], metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Dispatch to a configured backend (OpenAI) or fallback to echo.

    Behavior:
    - If `MCP_BACKEND` is set to `openai` and `OPENAI_API_KEY` exists, call OpenAI.
    - Otherwise return a simple echo response (safe default for local testing).
    """
    backend = os.getenv("MCP_BACKEND", "").lower()
    if backend == "openai" and os.getenv("OPENAI_API_KEY"):
        try:
            return await _call_openai(input_data, metadata)
        except Exception as e:
            return {"error": f"openai call failed: {e}"}

    # Fallback: echo the input
    await asyncio.sleep(0)
    return {
        "echo": input_data,
        "metadata": metadata,
        "note": "Minimal MCP server placeholder response (echo)",
    }


async def _call_openai(input_data: Dict[str, Any], metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Call OpenAI Chat Completion API in a thread-safe way.

    Expects `OPENAI_API_KEY` to be set in the environment. The function will
    accept either `input['messages']` (a list of message dicts) or
    `input['text']`/string and build a single user message.
    """
    try:
        import openai
    except Exception as e:
        raise RuntimeError("openai package is not installed") from e

    openai.api_key = os.getenv("OPENAI_API_KEY")

    messages = input_data.get("messages")
    if not messages:
        text = input_data.get("text") or str(input_data)
        messages = [{"role": "user", "content": text}]

    def sync_call():
        resp = openai.ChatCompletion.create(
            model=os.getenv("OPENAI_MODEL", "gpt-3.5-turbo"),
            messages=messages,
            temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.2")),
        )
        # Extract text content from the first choice
        choices = getattr(resp, "choices", None) or resp.get("choices")
        if choices:
            msg = choices[0].get("message") or choices[0].get("delta") or choices[0]
            content = msg.get("content") if isinstance(msg, dict) else None
            return {"model": resp.get("model", None), "content": content, "raw": resp}
        return {"raw": resp}

    result = await asyncio.to_thread(sync_call)
    return result
