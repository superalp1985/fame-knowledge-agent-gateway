# Deployment

## Local Development

```bash
npm run install:all
npm run generate:all
npm run dev
```

In another terminal:

```bash
npm run gateway
```

## Environment

Use `.env.example` as a template.

Required for real use:

```bash
FAME_GATEWAY_DEV_API_KEY=<replace>
FAME_MCP_API_KEY=<replace>
FAME_APPROVAL_SECRET=<replace>
```

Recommended:

```bash
FAME_GATEWAY_HOST=127.0.0.1
FAME_GATEWAY_PORT=5191
FAME_KNOWLEDGE_SOURCE=public
```

## Runtime Store

The gateway writes a local SQLite database:

```text
runtime_store/gateway/gateway.sqlite
```

This is local runtime state and should not be committed.

## Production Notes

- Put the gateway behind a local reverse proxy if exposing it beyond localhost.
- Use TLS if traffic crosses a network boundary.
- Rotate `FAME_APPROVAL_SECRET` before real deployment.
- Use per-agent API keys instead of the default dev key.
- Keep `knowledge_backup/` out of the repository.
- Keep raw multimodal payloads in an asset database/store; publish only light indexes and refs.

## Health Check

```bash
curl http://127.0.0.1:5191/health
```

Expected:

```json
{
  "ok": true,
  "status": "ready"
}
```

## Smoke Test

```bash
npm run gateway:smoke
```

This validates HTTP, MCP, auth, HMAC token enforcement, scheduler, semantic search, asset sync and trace export.
