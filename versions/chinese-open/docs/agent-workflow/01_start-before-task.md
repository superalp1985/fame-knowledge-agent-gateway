# 01 启动前

Agent 接到任务后先读：

1. `knowledge/route_index.json`
2. `knowledge/indexes/subject_index.json`
3. `knowledge/language-tree-hub/core.json`
4. `knowledge/language-tree-hub/lexicon_seed.json`
5. `knowledge/language-tree-hub/thought_modes.json`
6. `knowledge/indexes/scoping_index.json`
7. `knowledge/agent-tooling/stability_scenarios.json`
8. `knowledge/agent-tooling/tool_gateway_policies.json`
9. 与任务相关 subject 的 `taxonomy.json`

也可以直接让 CLI 生成最小上下文包：

```bash
npm run route:chinese-open -- --goal "<用户目标>" --compact
```
