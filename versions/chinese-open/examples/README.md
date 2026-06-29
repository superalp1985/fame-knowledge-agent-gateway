# 中文开源版接入样例

这里放最小、可复制的外部 Agent 接入样例。样例只展示协议边界，不替代知识网本体。

## 样例文件

- `external-agent-bootstrap.md`：外部 Agent 第一次接入时可放进系统提示或开发者提示的启动流程。
- `route-output.example.json`：`scripts/chinese-open-route.mjs` 的压缩输出样例。
- `tool-result-summary.example.json`：工具执行后的摘要回写样例。

## 推荐验证

```bash
npm run route:chinese-open -- --goal "修改 JSONL 知识库并同步索引"
npm run route:chinese-open -- --list-scenarios --format md
node versions/chinese-open/tests/agent-effect-smoke.mjs
node scripts/check-chinese-open.mjs
```

