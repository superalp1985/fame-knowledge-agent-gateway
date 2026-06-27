# Animation Worker Protocol v0.1

## 目标
先统一动画 worker 输入/输出协议，不先调 Code2Video / Manim / OpenGL / VLM 等重依赖。

## 当前 API
```text
POST /animation/plan
```

## 输入
`AnimationPlanRequest`：
- concept
- teaching_goal
- narration
- duration_seconds
- visual_style
- target_worker

## 当前输出 artifacts
- `handoff_audit`：动画简报交给 Code2Video-style worker 前的审计记录。
- `animation_brief`：动画任务简报。
- `animation_plan`：结构化 JSON，包括 scenes、visual、narration、risk_notes。

## 当前实现
`src/adapters/animation_worker.py` 中的 `AnimationPlanWorker` 只生成 plan，不执行 Manim/Code2Video。

## 替换路径
后续接 Code2Video 时保持 API 不变：

```text
上游概念/课程 → AnimationPlanRequest → 前置审计 → Animation worker → artifacts
```

## 安全边界
- 代码执行必须进入独立 worker/sandbox。
- 外部 icon/image/素材必须做授权审计。
- v0.1 不运行生成代码。

## 下一步
1. 生成 Manim pseudo-code。
2. 接 Code2Video dry-run。
3. 接独立 Python/Manim 环境。
4. 产出 mp4/gif/webm。
