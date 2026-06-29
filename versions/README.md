# Editions

This directory separates release-facing edition notes from the shared runtime, workbench and gateway code.

## Chinese Edition

`versions/chinese/` documents the current full Chinese edition when present. The public repository should not assume private knowledge data exists.

Shared runtime code remains at the repository root:

```text
knowledge/
workbench/
runtime_server/
memory/
asset_store/
```

## Chinese Open Edition

`versions/chinese-open/` is a clean Chinese open-source seed. It preserves the Language Tree mechanism and rebuilds a normative core around:

```text
语言树中枢
-> 逻辑
-> 数学
-> 计算机科学
-> Agent 工具调取
-> PowerShell 安全语法
```

External agents should start from `versions/chinese-open/docs/07_Agent协议与最小接入.md`.

## English Open Edition

`versions/english/` is a clean English open edition aligned with `chinese-open` in route ids, scenario ids, content unit ids, golden tasks and real evaluation flow.

It starts from:

```text
Language Tree Hub
-> Logic
-> Mathematics
-> Computer Science
-> Agent Tooling
-> PowerShell Safety
```

The English knowledge base is intentionally compact, not incomplete in mechanism. Subject-by-subject expansion should keep FAME route parameters, project-memory isolation, context-health rules, tool governance and multimodal light-index boundaries unchanged.

External agents should start from `versions/english/docs/agent-protocol.md`.

## Alignment Checks

```bash
npm run check:chinese-open
npm run check:english
npm run check:editions
```
