# Deployment

## Local Development

Recommended one-click startup on Windows:

```powershell
.\start.ps1
```

or:

```bat
start.bat
```

The startup script sets UTF-8 output, installs Workbench dependencies when missing, runs generators, starts Runtime Gateway and Workbench, writes logs to `logs/`, and opens the browser.

Cross-platform equivalent:

```bash
npm run start
```

Preview mode:

```bash
npm run start:preview
```

Manual startup:

```bash
npm run install:all
npm run generate:all
npm run dev
```

In another terminal:

```bash
npm run gateway
```

## First-run Agent Wizard

Open Workbench and go to `Agent Runtime`. The first-run wizard lets users choose `chinese-open` or `english`, select an Agent preset or `Other`, copy the connection message, generate config snippets, and confirm after the Agent acknowledges the protocol. The wizard does not silently rewrite local Agent configuration.

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

## Portable Zip

```bash
npm run package:portable
```

The package script runs edition checks, English doctor and Workbench build, then creates:

```text
.tmp/release/fame-knowledge-agent-gateway-portable.zip
```

The portable package excludes `node_modules`, private knowledge backups, runtime stores, logs and build caches.

## GitHub Release One-click Install

Release assets are generated with:

```bash
npm run build:release-assets
```

The GitHub release workflow uploads:

```text
install.ps1
fame-knowledge-agent-gateway-v<version>-portable.zip
fame-knowledge-agent-gateway-v<version>-portable.zip.sha256
release-assets.json
```

Windows users can install from the latest GitHub Release:

```powershell
Invoke-WebRequest -Uri "https://github.com/<owner>/<repo>/releases/latest/download/install.ps1" -OutFile "install.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1
```

The installer prefers a non-system drive when one is available. Users can choose an explicit location:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1 -InstallDir "<non-system-drive>\FAME\KnowledgeAgentGateway"
```

If Node.js 24+ is not available, the installer downloads a portable Node.js runtime into the install directory under `.tools/` and does not modify the global PATH.

## Docker

```bash
docker compose up --build
```

Container ports:

```text
5178 -> Workbench
5191 -> Runtime Gateway
```

The Dockerfile defaults to the official Node 24 Bookworm slim base image. Compose uses a configurable build argument so users behind unstable Docker Hub routing can switch mirrors or use the tested Microsoft Dev Containers Node image:

```bash
FAME_DOCKER_BASE_IMAGE=node:24-bookworm-slim docker compose up --build
```

On Windows PowerShell:

```powershell
$env:FAME_DOCKER_BASE_IMAGE = "node:24-bookworm-slim"
docker compose up --build
```

Runtime services bind to `0.0.0.0` inside the container. Runtime data and logs are persisted with Compose volumes.
