# LLM Tool Planner v0.1

## 目标
让 Chat 不只是关键词命令，也能由模型参与判断意图，并统一调本地工具。

## 实现
```text
src/tool_planner.py
```

核心：
- `ToolPlanner`
- `ToolPlan`

## 支持 action
```text
status
gate
tasks
web_search
course_production
general
```

## 规划策略
1. 高置信本地启发式优先，保证明显工具指令稳定执行。
2. 模糊意图再交给 LLM 规划。
3. LLM 规划要求输出 JSON：`action/query/topic/allow_web/confidence`。
4. 执行结果统一写入 Chat data：`tool_plan` + `result`。

## 为什么本地优先
测试发现模型有时会把“搜索/生成”当普通对话直接回答，导致工具不触发。改成本地高置信优先后稳定。

## LLM 接入
```text
src/llm_client.py
```

兼容：
- `/chat/completions`
- `/responses`

当前连接的服务 `/chat/completions` 返回空 SSE，`/responses` 可正常返回内容，因此自动 fallback 到 `/responses`。

## UI 调整
主对话框高度扩大 3 倍：
```css
.chat-messages { min-height: 360px; max-height: 720px; }
```

## 测试结果
```text
status -> status
search AI finance digital transformation -> web_search
create AI finance course -> course_production
PLANNER_ROUTE_OK 200
healthcheck_studio.py OK
```
