# ClawBot Bridge v0.1

## 结论
当前 UI 对话框已经有 Chat API，但默认是 `local_rules` 本地命令路由，不是假装已经接入真正 OpenClaw/ClawBot 主脑。

## 实现
```text
src/clawbot_bridge.py
```

核心：
- `ClawBotBridge`
- `ClawBotBridgeStatus`

## API
```text
GET /bridge/status
POST /chat/send
```

## 模式

### local_rules
默认模式。没有配置真实 ClawBot endpoint 时使用。

用途：
- 查看状态
- 检查门禁
- 列最近任务
- 发起课程生产

### external_http
配置环境变量后启用：

```powershell
$env:JIANMU_CLAWBOT_API_URL = "[REDACTED_URL]"
```

此时用户在 UI 输入：

```text
clawbot <message>
```

会转发到该 HTTP endpoint。

## UI 提示
聊天框会显示当前连接模式：

```text
连接模式：local_rules · 本地命令路由
```

如果配置了 endpoint，则显示 external_http 和 URL。

## 测试结果
```text
/bridge/status 200
/chat/history 200
POST /chat/send clawbot help 200
node --check ui/assets/app.js OK
healthcheck_studio.py OK
```

## 说明
未来如果 OpenClaw/ClawBot 暴露稳定 HTTP/ACP endpoint，只需要配置 `JIANMU_CLAWBOT_API_URL` 或替换 `ClawBotBridge.send()`，UI 不需要改。
