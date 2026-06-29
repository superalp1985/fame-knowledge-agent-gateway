# 02 Claude Desktop / MCP

推荐包装成四个入口：

- resource：`versions/chinese-open/knowledge/**`
- tool：`npm run route:chinese-open -- --goal "<goal>" --compact`
- prompt：`npm run route:chinese-open -- --scenario scenario-external-agent-integration --format prompt`
- connect：`npm run connect:chinese-open -- --agent claude-desktop --json`

MCP server 只暴露路由和摘要，不把完整知识网一次性返回给模型。
