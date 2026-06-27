# Chat UI v0.1

## 目标
补上直接文字对话框，让 UI 不只是后台工作台，也有“Claw Bot 统一调配任务”的自然入口。

## 后端
```text
src/chat.py
```

API：
```text
GET /chat/history
POST /chat/send
```

## 当前支持指令
- `状态` / `status`：查看 dashboard 摘要。
- `检查门禁` / `gate`：查看 integration gate。
- `最近任务` / `tasks`：列最近任务。
- `生成 <主题> 课程包` / `create <topic> course`：提交异步课程生产任务。
- 其它输入：返回帮助提示。

## 前端
文件：
```text
ui/index.html
ui/assets/styles.css
ui/assets/app.js
```

新增：
- Claw Bot 对话面板。
- 用户/助手气泡。
- Enter 发送。
- 发送后右侧详情显示结构化 data。
- 生成任务后自动轮询 job。

## 测试结果
```text
POST /chat/send status 200
POST /chat/send gate 200
POST /chat/send tasks 200
POST /chat/send create AI finance course 200
UI_CHAT 200
```

## 注意
PowerShell 管道测试中文 stdin 容易乱码，因此测试同时支持英文/pinyin 指令；浏览器 UI 中中文输入正常。
