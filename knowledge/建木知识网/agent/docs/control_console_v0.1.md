# Control Console v0.1

## 目标
把 UI 从单纯任务页面推进为本地控制台：打开程序可看后台状态、配置 API、管理计划任务、请求重启 Agent 后台。

## 后端新增
```text
src/settings_store.py
src/scheduler_service.py
```

## API
```text
GET /settings
POST /settings
GET /schedules
POST /schedules
DELETE /schedules/{job_id}
POST /schedules/{job_id}/toggle
POST /control/restart-agent
```

## UI 新增
设置页：
- ClawBot API URL
- 默认主题
- 默认受众
- 重启 Agent 后台按钮
- 计划任务管理

## 后台启动
FastAPI startup 会启动 `SchedulerService().start()`。

真实 uvicorn 服务验证：
```text
/settings 200
/schedules 200 True
/bridge/status 200 local_rules
/dashboard 200 jianmu.agent.dashboard.v0.1
```

## 计划任务边界
v0.1 的计划任务会写入：
```text
data/main_conversation_outbox.jsonl
```

这表示“准备发送给主对话框”的 outbox。当前还没有真正调用 OpenClaw 主会话发送接口。

要做到真正发送，需要后续二选一：
1. OpenClaw/ClawBot 暴露 main-session message HTTP/ACP endpoint；
2. Tauri supervisor 作为外层进程，读取 outbox 并调用 OpenClaw 内部能力发送。

## 重启后台边界
`POST /control/restart-agent` 当前只返回安全提示：
```text
manual_restart_required
```

原因：网页后端不能安全杀死并重启自己。真正一键重启应由 Tauri supervisor 负责。

## 下一步
- Tauri supervisor：负责启动/停止/重启 FastAPI 后台。
- Outbox bridge：把计划任务真正投递到 OpenClaw 主对话框。
- Settings 加密/脱敏：保存 API key 时避免明文展示。
