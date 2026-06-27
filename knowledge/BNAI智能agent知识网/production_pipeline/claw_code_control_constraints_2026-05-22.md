# Claw Code 中控约束与建木当前状态基线（2026-05-22）

## 目的

本文件给 Claw Code / Agent Studio 中控层作为启动前约束与项目状态基线使用。它不是成果展示文档，而是运行时行为边界：Claw Code 在规划、路由、调用 worker、生成 prompt、判定 final/preview 前必须读取并遵守。

## 当前项目进度快照

### v0.1 基线能力

建木 Agent Studio 已形成本地工作台雏形：

1. Tauri/UI 方向已定，第一阶段先跑通 CLI/文件型流水线。
2. FastAPI API Gateway 已完成最小闭环。
3. `POST /tasks/course-pack` 已串起建木 Adapter、课程包生成、Marp PDF 导出与 artifacts 返回。
4. `route_index.json` 已接入真检索，不再是文件名 stub。
5. Web Research Adapter v0.1 已接入，外部内容只作为临时证据，不直接污染建木知识网。
6. 成熟模块候选已初审：PPTAgent / DeepPresenter、PresentAgent-2、Code2Video、DocAgent；重依赖模块走独立 worker 或 sandbox，不嵌入 Gateway 主进程。

### 2026-05-21 夜间精修状态

1. 已支持多场景实际测试：本地图片路径分析、本地文档导出 Office、教学动画生成、Code2Video sandbox request、从本地文件生成完整成果包。
2. `CourseProductionRouter` 已新增 `00_studio_run_summary.md`。
3. `00_artifact_inventory.json` 已增加 `recommended_first_open` 与 `download_hint`。
4. `00_failure_notes.md` 只在缺失文件或云端响应异常时生成。
5. 已修复离线意图误判：`不联网/不要联网/无需联网/no web/offline` 必须优先识别为 offline，不得因为包含“联网”二字误判为允许联网。
6. 复合意图增强：`完整成果/一整套/做一套/全套/成果包/pipeline/工作流/流水线` 以及带路径的生成型任务必须进入 `course_production` pipeline。
7. 已知测试边界：TestClient 提交异步完整 pipeline 后可能因后台线程生命周期导致测试进程挂住；live 服务重启后正常。
8. 工程记录：`[REDACTED_LOCAL_PATH]`。

### 质量状态纠偏

老板已明确纠偏：当前功能链路虽然打通，但产出质量仍偏原型级，不能因“能跑”就自满。后续主线从堆功能转向：

1. 质量引擎。
2. 总导演层。
3. 内容精修。
4. 视觉精修。
5. 视频精修。
6. 端到端 UTF-8 / 字体 / 中文渲染排查。

乱码、问号、中文渲染异常是精品化阻塞项。必须区分第三方库内部占位符与我方产物/界面真实乱码；我方产物和 UI 中的乱码必须优先修。

## 建木多模态知识网补充状态

### 专业范围

多模态知识网主目录：

```text
[REDACTED_LOCAL_PATH]
```

第一阶段专业内容从 5 类开始：

1. 美术基础。
2. 叙事基础。
3. PPT 基础。
4. 视频基础。
5. 音乐基础。

音乐必须做，不能打折。音乐虽不能用 Vision 审查，但必须有音频/音乐评价与修正机制。

### 语言树绑定

1. 建木语言树一级联想必须全接上，一个都不能漏。
2. 已生成 `language_tree_links/first_order_association.yaml`。
3. 当前覆盖 `route_index.json` 全部 2714 条 route。
4. 每条 route 均强制包含：文本、PPT、视频、音乐/声音、美术/视觉、图表/结构、叙事、质量检查、禁忌/反例。
5. 多模态生成不得停留在 text-only。

### 补库轮次

1. 第一版落地：64 个文件，覆盖美术、叙事、PPT、视频、音乐，并补入影视、音频、图表、动画、生产流水线基础规则。
2. 联网调研补厚：扩展到 84 个文件，新增调研来源、Agent 调用说明、美术/叙事/PPT/视频/音乐/影视/生产流水线规则。
3. 第二轮深补：扩展到 97 个文件，新增摄影、数据可视化、动画动效、声音设计、审美风格系统、案例/反例库、详细评分量表。
4. 第三轮可复用审查底座：扩展到 111 个文件，新增 review prompts、schemas、auto-fix work orders、高质量样例模式、可访问性规则。
5. 文本/研究层补齐：新增 `text_research/` 5 个文件，覆盖调查研究、长文分析、来源可信度、模块约束、研究 prompt 模板。
6. 模块质量门禁：新增 `production_pipeline/module_quality_gates.yaml` 与运行时代码 `src/module_quality.py`。
7. 文学知识网：新增 `literature/` 6 个文件与 `language_tree_links/literature_generation_policy.yaml`，用于讲稿、叙事、课程开场、案例改写、视频旁白、PPT 标题、音乐/画面意象。

### 当前校验结果

最近一次对齐记录显示：

1. route count = 2714。
2. 知识网文件数约 124。
3. `BAD_COUNT = 0`。
4. `LITERATURE_FILES = 6`。
5. 模块质量门禁 smoke test：`GATES 14`，`MODULE_ROUTING_OK True`。
6. 旧文件中出现的乱码审计命中主要是编码审计脚本/文档有意记录检查目标，不代表本轮新增污染；以知识网重建 `BAD_COUNT=0` 为准。

## Claw Code 中控必须遵守的运行链路

Claw Code 不得直接自由生成。必须按以下顺序执行：

```text
确定性知识路由
→ prompt/constraint 注入
→ content_kind 到模块显式分配
→ 每模块输出契约
→ 每模块质量门禁
→ 统一 manifest / quality report / memory
```

### 第 1 层：确定性知识路由

必须先读：

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

必须输出或记录 routing evidence：

1. query。
2. lookup_order。
3. route_index_hits。
4. multimodal_association_hits。
5. deterministic_pre_generation_routing = true。

### 第 2 层：prompt/constraint 注入

必须调用或等价遵守：

```text
[REDACTED_LOCAL_PATH]
```

核心函数：

```text
build_prompt_constraints(topic, style, limit)
```

约束块必须包含：

1. knowledge_first。
2. style_after_structure。
3. text_only_generation_allowed = false。
4. quality_gate_before_final。
5. route_index 命中。
6. multimodal 一级联想命中。
7. PPT / Video / Music / Art / Quality / Anti-patterns 摘要。
8. 文学表达约束。
9. 不得绕过建木知识网直接自由生成。

### 第 3 层：显式模块分配

必须调用或等价遵守：

```text
[REDACTED_LOCAL_PATH]
```

核心类：

```text
ModuleRoutingTable
```

课程成果包当前至少包含以下 10 个步骤：

1. `course_pack`：研究简报、大纲、讲稿、seed slides、来源、路由证据。
2. `ppt_draft`：大纲/讲稿 → PPTAgent/DeepPresenter。
3. `video_plan`：讲稿/幻灯片 → PresentAgent-2/TTS/ffmpeg 视频计划。
4. `animation_plan`：核心机制/变量关系 → Code2Video/Manim。
5. `localization`：讲稿/字幕 → 多语言讲稿与字幕包。
6. `image_generate`：封面/插图/视觉资产 → Image/ComfyUI-ready。
7. `office_export`：Markdown → Word/HTML/Office 文档。
8. `music_generate`：简单低干扰 BGM loop。
9. `weavemuse_compose`：结构化原创配乐、motif、MIDI/WAV。
10. `edge_tts`：讲稿 → 语音音频。

功能模块矩阵必须覆盖：

1. WebResearchAdapter。
2. DocAdapterLite。
3. LocalMultimodalFileAdapter。
4. LocalizationWorker。
5. OfficeExportWorker。
6. EdgeTTSWorker。
7. PptDraftWorker。
8. VideoPlanWorker。
9. ImageGenerationWorker。
10. MusicGenerationWorker / WeaveMuseWorker。
11. AnimationPlanWorker。

### 第 4 层：研究和长文约束

必须读：

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

硬规则：

1. 调查研究必须先问题定义、概念树、证据等级、反证检查。
2. 长文分析必须拆结构层、概念层、论证层、数据层、风险层、输出层。
3. 不得把搜索摘要直接当事实。
4. 不得用单来源支撑关键判断。
5. 不得隐瞒读取失败、截断、OCR 失败或不支持格式。
6. 外部网页内容只能作为临时证据，不得直接写入建木知识网。

### 第 5 层：模块级质量门禁

必须读：

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

硬规则：

1. 每个模块必须有明确 owner。
2. 每个模块必须有 required artifact kinds。
3. 每个模块必须检查 hard fail vocabulary。
4. preview 不是 final。
5. hard fail 必须进入修正或人工复核。
6. 文件存在不等于质量通过。
7. 质量门禁结果必须进入 `00_module_quality_gates.json`、`00_module_quality_gates.md`、`00_quality_report.md`。

### 第 6 层：文学表达约束

必须读：

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

硬规则：

1. 文学性不得压过事实准确。
2. 修辞必须能映射到主题、证据或结构。
3. 情绪表达必须有材料支撑。
4. 正式语境必须克制。
5. 课程开场、案例叙事、视频旁白、PPT 标题可以有文学性，但不得牺牲清晰度。

## 当前最重要的后续工作

1. 优先修复端到端中文乱码、字体缺失、问号、导出编码污染。
2. 从“功能能跑”转向“质量能打”：总导演层、质量评分、自动修正闭环。
3. 让每个成果包都能清楚说明：用了哪些建木知识、哪些外部证据、分给了哪些模块、哪些质量门禁通过/未过。
4. 重 worker 不进 Gateway 主进程；PresentAgent-2、Code2Video、PPTAgent 等走 sandbox/worker 协议。
5. 云端失败不得影响本地 fallback；本地 fallback 产物必须标注 preview/fallback，不得伪装 final。
6. API Key 不回显、不写入记忆、不进入成果包。
7. 计划变更必须先停下来等老板确认，不得自行替换老板原创架构。

## Claw Code 启动前检查清单

每次接手建木 Agent Studio 前，至少检查：

1. `[REDACTED_LOCAL_PATH]`
2. `[REDACTED_LOCAL_PATH]`
3. `[REDACTED_LOCAL_PATH]`
4. `[REDACTED_LOCAL_PATH]`
5. `[REDACTED_LOCAL_PATH]`
6. `[REDACTED_LOCAL_PATH]`
7. `[REDACTED_LOCAL_PATH]`
8. `[REDACTED_LOCAL_PATH]`

如果这些文件之间出现冲突，以“老板最近明确确认的口径”和本文件的中控硬约束为准；不确定时停止执行并回问老板。
