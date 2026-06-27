# 建木 Agent Studio 试用说明 v0.1

## 启动
在 `[REDACTED_LOCAL_PATH]` 下运行：

```powershell
python scripts\run_studio.py
```

默认地址：

```text
htt[REDACTED_LOCAL_PATH]
```

脚本会尝试自动打开浏览器。若浏览器没弹出，手动打开上述地址即可。

## 状态检查
```powershell
python scripts\status_studio.py
```

会检查当前 `htt[REDACTED_LOCAL_PATH]` 是否已经运行，并验证：
- `/`
- `/dashboard`
- `/contracts/gate`
- `/workers/health`

## 端口占用排查
如果重复启动看到 Windows `10048` 端口占用错误，说明 8765 已有服务在跑。查看占用进程：

```powershell
python scripts\find_port_owner.py
```

如确实需要强制停止，可手动执行：

```powershell
taskkill /PID <pid> /F
```

## 自检
```powershell
python scripts\healthcheck_studio.py
```

会检查：
- UI 首页
- Dashboard
- Contracts
- Contract Health
- Integration Gate
- Worker Health
- Tasks
- Course Production
- Manifest Validate
- Contract Validate
- Artifacts
- Audits

## 当前实测状态

2026-05-21 16:57，服务已在本机运行：

```text
URL: htt[REDACTED_LOCAL_PATH]
PID: 27576
/                  200 OK
/dashboard         200 OK
/contracts/gate    200 OK
/workers/health    200 OK
```

## UI 测试流程

1. 打开首页 `/`。
2. 看四个指标卡：系统状态、任务、Worker、协议。
3. 点击“检查门禁”，右侧详情应显示 `ok: true`。
4. 点击“生成课程包”，等待同步任务完成。
5. 进入“任务”，点击最新任务。
6. 右侧应出现 artifact 列表。
7. 点击 `research` / `outline` / `script` 等文本产物的“读取”。
8. 点击“异步生产”，观察右侧 job 状态从 `running` 到 `ok`。

## 当前能力边界
- 当前 UI/后端已经能做完整端到端试用。
- PPT/video/animation/localization 当前仍是 adapter/protocol/scaffold 产物，不是最终重型 worker 成品。
- 后续接真实 PPTAgent / PresentAgent-2 / Code2Video 时，上游 contract 不应破坏。

## 停止服务
在启动服务的终端按：

```text
Ctrl+C
```
