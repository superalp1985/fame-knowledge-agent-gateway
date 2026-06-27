# UI Prototype v0.1

## 目标
做一个稳重大气、参照 Office 使用习惯的第一版 UI 原型，先作为 Web UI 挂在 FastAPI 上，后续再封装 Tauri。

## 文件
```text
ui/index.html
ui/assets/styles.css
ui/assets/app.js
```

## FastAPI 挂载
```text
GET /
/ui/assets/styles.css
/ui/assets/app.js
```

## 设计口径
- 稳重大气，不走花哨赛博风。
- 左侧导航：总览 / 任务 / 模块 / 协议。
- 顶部标题区 + Ribbon 功能区，靠近 Office 操作习惯。
- 主区域：指标卡、最近任务表、系统门禁摘要。
- 右侧详情面板：查看任务、worker、contract 的 JSON/detail。
- 色彩：深蓝侧栏、白底卡片、浅灰背景、Office 风格蓝色主按钮。

## 功能
- `/dashboard` 拉取首页总览。
- 刷新状态。
- 同步生成课程包。
- 异步生产并自动轮询 job 状态。
- 查看 integration gate。
- 查看 contracts。
- 打开任务详情。
- 查看任务 artifact 列表。
- 读取文本 artifact；PDF/二进制显示类型和路径。
- 查看 manifest validation、contract validation、audit 回放结果。

## 测试结果
```text
/ 200 text/html; charset=utf-8
/ui/assets/styles.css 200 text/css; charset=utf-8
/ui/assets/app.js 200 text/javascript; charset=utf-8
/dashboard 200 application/json
DASHBOARD 200 ok True
/tasks/{latest}/artifacts 200
/tasks/{latest}/manifest/validate 200
/tasks/{latest}/contracts/validate 200
/tasks/{latest}/audits 200
```

完整 smoke 仍通过到：
```text
ASYNC_JOB 200 ok
```

## 说明
浏览器工具因策略不访问本机 127.0.0.1，未做截图验证；已用 FastAPI TestClient 验证页面、CSS、JS、Dashboard 均正常返回。
