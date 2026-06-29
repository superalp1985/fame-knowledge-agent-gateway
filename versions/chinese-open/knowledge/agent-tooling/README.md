# Agent 工具调取

Agent 工具调取分支用于让模型在调用工具前读取说明、校验 schema、控制风险、执行后回写记忆。

## 初始范围

- 工具说明读取
- schema 校验
- ProposedAction
- ApprovedAction
- Tool Gateway
- 结果摘要
- 失败复盘
- 工具稳定性场景矩阵

这部分是 FAME 作为 Agent 万能外部插件的核心接口层。

## 稳定性场景

`stability_scenarios.json` 把 PowerShell、JSONL、Git、Node/npm、Python、网络下载和外部 Agent 接入拆成可预检的场景。外部 Agent 不需要全量读知识网，先按场景拿 `required_routes` 和 `required_checks`，再生成工具动作契约。
