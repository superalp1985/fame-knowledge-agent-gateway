# 建木 Agent Studio 总架构图（v0.3）

```mermaid
flowchart TD
    U[用户] --> UI[Tauri 单窗口 UI<br/>Rust + WebView2]
    UI --> GW[API Gateway<br/>唯一入口 / 集中治理]

    GW --> AUTH[权限 / 配置 / 审计 / 日志]
    GW --> TASK[任务队列 / 状态管理 / 产物管理]
    GW --> CTRL[Claw Code 中控 Agent]

    CTRL --> PROTO[统一任务协议层<br/>Task Schemas / Worker Registry / Artifacts]
    PROTO --> AUDIT[前置交接审计<br/>文字交给下一级 worker 前先审计]

    AUDIT --> PLAN[任务规划器<br/>研究 / 备课 / 课件 / 视频 / 动画]
    AUDIT --> JIANMU[建木知识网 Adapter<br/>第一知识源]
    AUDIT --> WEB[Web Research Adapter<br/>外部临时证据]
    AUDIT --> DOC[DocAdapterLite<br/>长文档读取 / 大纲 / 分块]
    AUDIT --> PPT[PPT Worker Protocol<br/>PPTAgent / DeepPresenter]
    AUDIT --> VIDEO[Video Worker Protocol<br/>PresentAgent-2 / TTS / ffmpeg]
    AUDIT --> ANIM[Animation Worker Protocol<br/>Code2Video / Manim]
    AUDIT --> CHART[图表 Adapter<br/>Mermaid / ECharts]
    AUDIT --> MODEL[AI Model Adapter<br/>本地/远程模型统一封装]
    AUDIT --> RENDER[Media Render Layer<br/>ffmpeg / MoviePy]

    JIANMU --> K1[(entries)]
    JIANMU --> K2[(rules)]
    JIANMU --> K3[(associations)]
    JIANMU --> K4[(route_index)]
    JIANMU --> K5[(reports/docs)]

    WEB --> EXT[外部来源<br/>URL / 时间 / 可信度 / 不默认入库]

    PLAN --> OUT[统一成果包]
    JIANMU --> OUT
    WEB --> OUT
    DOC --> OUT
    PPT --> OUT
    VIDEO --> OUT
    ANIM --> OUT
    CHART --> OUT
    RENDER --> OUT

    OUT --> A0[handoff_audit.json]
    OUT --> A1[研究简报.md]
    OUT --> A2[课程大纲.md]
    OUT --> A3[逐页讲稿.md]
    OUT --> A4[课件.md/.pptx/.pdf]
    OUT --> A5[视频脚本.md/.srt]
    OUT --> A6[video_plan.json / 成片.mp4]
    OUT --> A7[animation_plan.json / 动画片段.mp4]
    OUT --> A8[来源清单.md]
    OUT --> A9[知识回写建议.md]

    subgraph Sandbox[内置运行环境 / worker 沙盒]
      CTRL
      PROTO
      AUDIT
      PLAN
      JIANMU
      WEB
      DOC
      PPT
      VIDEO
      ANIM
      CHART
      MODEL
      RENDER
    end
```

## 核心原则
1. 用户只面对 Tauri 单窗口。
2. API Gateway 是唯一入口，负责集中治理。
3. Claw Code 是中控，负责调度工具和整合成果。
4. **统一任务协议层先于具体 worker**：先定义 schema、registry、artifact，再接 PPTAgent/PresentAgent-2/Code2Video 等重模块。
5. **审计前置**：Claw Code 把文字交给下一级 worker 前就生成 handoff audit，不等成品出来。
6. v0.1 审计默认 non-blocking：先记录/告警，优先保证模块集成速度。
7. 建木知识网是第一知识源。
8. Web 搜索只做补充证据，默认不入库；入库必须生成建议并人工确认。
9. Doc/PPT/Video/Animation 都是后台 worker，不是主脑。
10. 环境随应用一起封装，目标是装到任意电脑都能用。

## 当前 v0.1 已接 API
- `GET /health`
- `GET /workers`
- `GET /workers/{worker_name}`
- `POST /documents/outline`
- `POST /ppt/draft`
- `POST /video/plan`
- `POST /animation/plan`
- `POST /tasks/course-pack`

## 近期接入顺序
1. 保持协议层稳定。
2. 给每个 worker 补 dry-run / plan-only 模式。
3. 再接真实重依赖：PPTAgent、PresentAgent-2、Code2Video、TTS、ffmpeg。
4. 最后做 Tauri UI 封装与运行时打包。
