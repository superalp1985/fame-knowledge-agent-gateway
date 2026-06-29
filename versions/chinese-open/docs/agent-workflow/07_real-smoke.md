# 07 实机烟测

中文开源版提供轻量脚本，用来测试外部 Agent 接入是否便利、上下文是否裁剪、工具动作契约是否完整：

```bash
node versions/chinese-open/tests/agent-effect-smoke.mjs
```

通过标准：

- 能把 `语义树` 归一到 `language-tree-hub`。
- 能找到球门逆推、全局态势、工具动作契约、高频坑位预检和接入便利性测试路线。
- 生成的 ContextPack 不全量加载知识网。
- 工具动作契约包含工具名、动作类型、作用域、预期信号和验证计划。
