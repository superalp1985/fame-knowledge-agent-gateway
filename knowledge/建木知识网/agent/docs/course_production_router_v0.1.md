# Course Production Router v0.1

## 目标
把分散 API 串成一个统一成果包任务。

## API
```text
POST /tasks/course-production
```

## 链路
```text
AgentTask
→ course-pack
→ PPT draft
→ video plan
→ animation plan
→ bundle handoff audit
→ manifest
```

## Claw Code 的角色
Claw Code 在这里不是简单调度器，而是跨语言/跨模态/跨工具的逻辑翻译层：

- 建木 route graph → PPT 大纲
- 课程讲稿 → 视频计划
- 核心机制 → Code2Video/Manim 动画简报
- 未来：中文讲稿 → 多语种 PPT / 字幕 / 语言包
- 未来：同一业务逻辑 → Python / JavaScript / Go / Rust 微服务代码与日志配置

## 当前输出
- `manifest`：统一成果包清单，采用 `jianmu.agent.artifact_manifest.v0.1` schema。
- `bundle_handoff_audit`：总交接审计。
- course-pack artifacts。
- ppt artifacts。
- video artifacts。
- animation artifacts。
- localization artifacts。

## Manifest 增强
每个 artifact record 包含：
- kind / title
- absolute path / relative_path
- exists / size_bytes / sha256
- producer / step
- audit_path

## 当前策略
- 先串总链路。
- 所有重 worker 保持 plan-only / dry-run。
- 审计 non-blocking。
- 后续逐个替换 worker 内部实现。

## 下一步
1. manifest 增加 artifact hash 和 relative path。
2. task router 增加可选步骤参数。
3. 接多语言输出协议：language pack / subtitles / translated speaker notes。
4. 接真实 PPTX/TTS/ffmpeg/Code2Video dry-run。
