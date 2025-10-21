# MCP Integration Guide (Model Context Protocol)

This document sketches how to expose the Ref Parser API to LLM copilots via the Model Context Protocol (MCP). MCP enables models to retrieve context or execute tools on demand. See Anthropics’ MCP overview: https://docs.anthropic.com/en/docs/mcp-overview.

## 1. Architecture
- **Server:** Wrap Ref Parser endpoints inside an MCP server process exposing tools like `parse_passages`, `highlight`, `get_passage_text`.
- **Client:** Your Anthropic or other MCP-compatible assistant connects via WebSocket or HTTP to call those tools.
- **Context Store:** Optionally persist recent sermon text states so the assistant can fetch latest drafts.

## 2. Implementation Steps
1. **Choose MCP SDK:** Anthropics provides reference implementations (Node & Python). Start with Node for easier reuse of existing TS code.
2. **Define Tools:** Map each API to an MCP tool schema (name, description, JSON schema for inputs/outputs).
3. **Implement Handler:** For example `parse_passages` invokes internal helper that calls the Next.js route or directly reuses `lib/passages/parse.ts` functions.
4. **Authentication:** Since MCP often runs co-located with trusted clients, you can omit heavy auth, but enforce rate limiting and request size checks.
5. **Register with Assistant:** Provide tool manifest to the model, ensuring `sermon-context` tool appears in system prompt.

## 3. Example Tool Schema
```json
{
  "name": "parse_passages",
  "description": "Identify Bible references in free text using the Ref Parser.",
  "input_schema": {
    "type": "object",
    "properties": {
      "text": { "type": "string" },
      "language": { "type": "string", "default": "en" }
    },
    "required": ["text"]
  },
  "output_schema": {
    "type": "object",
    "properties": {
      "rawOsis": { "type": "string" },
      "references": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "osis": { "type": "string" },
            "indices": { "type": "array", "items": { "type": "integer" } }
          }
        }
      }
    }
  }
}
```

## 4. Deployment Considerations
- **Hosting:** Run MCP service alongside Next.js API or as separate Node process sharing the `lib/` helpers.
- **Config:** Provide environment variables for base URL, API key, or direct module imports.
- **Security:** Restrict which models/users can access the MCP tools; validate input size to prevent massive payloads.
- **Observability:** Log tool invocations and durations for auditing the assistant interactions.

## 5. Next Steps
- Prototype Node MCP server: import `lib/passages/*` and expose tools with minimal transformation.
- Add tests verifying JSON schema compliance.
- Publish manifest to internal copilot(s) and document usage for engineers.
