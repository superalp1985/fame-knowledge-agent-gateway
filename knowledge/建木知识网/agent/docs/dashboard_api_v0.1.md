# Dashboard API v0.1

## 目标
给 Tauri / Web UI 首页一个“一次请求拿全局状态”的接口，避免前端反复调用多个后端 API 拼装。

## 实现
```text
src/dashboard.py
```

核心：
- `DashboardService`

## API
```text
GET /dashboard?recent_limit=10
```

## 返回内容
- schema
- generated_at
- status
- jianmu health
- inventory
- gate
- workers summary + items
- contracts summary + items
- recent tasks + counts
- jobs summary + items

## 状态逻辑
- `gate.ok == true` → dashboard `status = ok`
- 否则 → `status = attention`

## 测试结果
```text
DASHBOARD 200 ok True
```

## 说明
这是后续 Tauri 首页 / 控制台总览 / 系统托盘状态的主入口。
