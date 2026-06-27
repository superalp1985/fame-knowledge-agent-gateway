# 建木多模态知识网建设决策对齐（2026-05-22）

## 项目定位

建木多模态知识网不是素材库、提示词库或 Adapter 配置库，而是建木知识体系中负责“表达、呈现、审美、时间、空间、声音、影像”的专业知识分支。

它必须继承建木原有原则：

1. 以语言树为主干。
2. 以抽象规律、知识点、表达技法、创作流程、工程约束、质量评价分层。
3. 所有多模态知识必须与语言树连接。
4. 一级联想必须全接上，一个都不能漏。
5. 专业规律优先于素材堆积。
6. 质量门槛硬执行，不合格不得标记为 final。

## 目录位置

主知识放在建木知识网主目录下：

```text
[REDACTED_LOCAL_PATH]
```

Agent 工程目录只放 adapter、缓存、索引和调用逻辑，不承载主知识。

## 第一阶段专业内容范围

老板确认：专业内容先从以下 5 类开始补齐。

1. 美术基础
2. 叙事基础
3. PPT 基础
4. 视频基础
5. 音乐基础

这 5 类是多模态质量的底座，后续影视、动画、声音设计、图表、摄影、剪辑等从这里继续展开。

## 语言树一级联想要求

建木语言树一级联想必须全接上，一个都不能漏。

每个语言树节点/概念/抽象规律，至少要建立以下联想入口：

- 文本表达
- PPT 表达
- 视频表达
- 音乐/声音表达
- 美术/视觉表达
- 图表/结构表达
- 叙事表达
- 可用资产或模板
- 质量评价要点
- 禁忌/反例

第一版连接形式使用 YAML。

## Vision / 多模态自动审查范围

Vision 审查不能做轻量版，必须朝复杂自动修正闭环建设。

第一阶段必须覆盖：

1. PPT 截图审查与自动修正
2. 视频关键帧审查与自动修正
3. HTML/图表截图审查与自动修正
4. 音乐质量审查与自动修正

音乐不能打折。音乐虽然不能用 Vision 审查，但必须建立音频/音乐评价与修正机制，例如：节奏、情绪、结构、长度、循环点、音量、旁白冲突、BGM 适配度。

## 质量门槛

确认采用硬门槛：

- 内容低于阈值：不进入正式 PPT / 视频阶段。
- PPT 低于阈值：不得标记为 final。
- 视频低于阈值：只标记为 preview。
- 音乐低于阈值：不得进入正式成片。
- 乱码、遮挡、溢出、音画不同步、字幕遮挡主体、色彩不可读等硬伤：直接 fail 或进入自动修正。

## 推荐知识网结构

```text
multimodal_knowledge/
  00_index.md
  01_design_principles.md
  02_language_tree_binding.md

  language_tree_links/
    first_order_association.yaml
    concept_to_modality.yaml
    abstraction_to_expression.yaml

  art/
    composition.md
    color_theory.md
    typography.md
    visual_hierarchy.md
    aesthetics_rubric.md
    style_systems.md

  narrative/
    narrative_structure.md
    rhetoric_and_explanation.md
    tension_and_release.md
    teaching_storytelling.md
    narrative_rubric.md

  ppt/
    how_ppt_works.md
    slide_types.yaml
    layout_principles.md
    storytelling_in_slides.md
    chart_and_diagram_rules.md
    ppt_quality_rubric.md

  video/
    how_video_works.md
    timeline_principles.md
    shot_language.md
    editing_rhythm.md
    subtitle_rules.md
    motion_graphics.md
    video_quality_rubric.md

  music/
    how_music_works.md
    melody.md
    harmony.md
    rhythm.md
    arrangement.md
    emotion_mapping.md
    music_for_video.md
    music_quality_rubric.md

  production_pipeline/
    timeline_protocol.md
    visual_verification_loop.md
    audio_verification_loop.md
    auto_revision_protocol.md
    quality_gate.md
    asset_binding.md
```

## 落地状态（2026-05-22 00:50）

第一版已完成落盘：

- 主目录：`[REDACTED_LOCAL_PATH]`
- 文件数量：64 个
- 语言树一级联想：`language_tree_links/first_order_association.yaml`
- 已覆盖 route：2714 条
- 每条 route 均强制生成完整一级联想：文本、PPT、视频、音乐/声音、美术/视觉、图表/结构、叙事、质量检查、禁忌/反例。
- 编码检查：`???/????/�/锟/Ã/Â` 污染为 0。

本轮不是最终专业知识库，只是第一版可用底座。后续继续深化每个专业门类的理论、规则、反例和自动修正策略。

## 深化补库状态（2026-05-22 01:05）

老板指出“知识网太单薄”，本轮已联网调研并补厚第一版：

- 文件数量从 64 个扩展到 84 个。
- 新增调研来源记录：`[REDACTED_LOCAL_PATH]`。
- 新增 Agent 调用说明：`[REDACTED_LOCAL_PATH]`。
- 美术：补入 `design_principles_full.md`、`gestalt_and_composition.md`、`color_typography_accessibility.md`、`art_rulebook.yaml`。
- 叙事：补入 `narrative_director_full.md`、`narrative_patterns.yaml`。
- PPT：补入 `ppt_professional_system.md`、`ppt_page_system.yaml`。
- 视频：补入 `video_professional_system.md`、`video_scene_schema.yaml`。
- 音乐：补入 `music_professional_system.md`、`music_cue_library.yaml`。
- 影视：补入 `film_language_matrix.yaml`。
- 生产流水线：补入 `director_quality_loop_full.md`、`quality_score_schema.yaml`、`auto_revision_recipes.yaml`。
- 语言树连接：补入 `multimodal_generation_policy.yaml`、`domain_to_modality_defaults.yaml`。
- 重新生成并校验一级联想 YAML，仍覆盖 2714 条 route。
- 编码审计：检查 88 个相关 md/yaml/py/json 文件，污染为 0。

## 调研开工原则

1. 先调研专业规律，不急着写代码。
2. 每个领域都要抽象成“规律 + 知识点 + 可执行规则 + 评价标准”。
3. 调研结果必须能进入 YAML / Markdown 知识网，不写泛泛读书笔记。
4. 后续接入 Agent Studio 时，Claw Code 只读结构化知识与规则，不依赖长篇散文。

## 运行时接入状态（2026-05-22 01:38）

老板追问“知识网会不会直接影响输出的 prompt 和约束条件”。确认口径：必须影响，不能只做旁路参考。

本轮已把多模态知识网接入运行时 prompt/constraint 层：

- 新增：`[REDACTED_LOCAL_PATH]`
- 核心函数：`build_prompt_constraints(topic, style, limit)`
- 该函数在生成前确定性读取：
  - 主建木 `route_index`
  - `multimodal_knowledge/language_tree_links/first_order_association.yaml`
  - `multimodal_knowledge/language_tree_links/multimodal_generation_policy.yaml`
- 输出两类内容：
  - `constraint_markdown`：给 prompt / brief / request / board 直接阅读使用
  - `constraint_data`：给 worker / cloud payload / JSON plan 结构化使用

已接入的 worker：

1. `PptDraftWorker`
   - PPT request 包写入建木确定性约束。
   - Marp 草稿加入“建木约束”页。
   - cloud payload 携带 `jianmu_constraints` 与 `constraint_markdown`。
2. `VideoPlanWorker`
   - handoff、视频计划 JSON、视频讲稿、cloud payload 均带建木约束。
3. `ImageGenerationWorker`
   - 图片 plan JSON、prompt board HTML、cloud payload 均带建木约束。
4. `MusicGenerationWorker`
   - 音乐 plan JSON、cloud payload 均带建木约束。
5. `AnimationPlanWorker`
   - 动画 brief、动画计划 JSON、cloud payload 均带建木约束。
6. `WeaveMuseWorker`
   - 作曲 composition plan、brief、cloud payload 均带建木约束。

约束块强制包含：

- knowledge_first
- style_after_structure
- text_only_generation_allowed=false
- quality_gate_before_final
- route_index 命中
- multimodal 一级联想命中
- PPT / Video / Music / Art / Quality / Anti-patterns 约束摘要
- “不得绕过建木知识网直接自由生成”等硬约束

已完成校验：

```text
python -m py_compile src\prompt_constraints.py src\adapters\ppt_worker.py src\adapters\video_worker.py src\adapters\animation_worker.py src\adapters\multimodal_worker.py src\adapters\weavemuse_worker.py src\adapters\jianmu_adapter.py src\pipeline.py
```

已完成最小运行测试：

- `build_prompt_constraints('预算绩效管理课程PPT', '高校财务干部培训')` 返回 1873 字符约束块，包含 route 与 multimodal 命中。
- `ImageGenerationWorker` 测试通过。
- `MusicGenerationWorker` 测试通过。

## 模块路由接入状态（2026-05-22 01:44）

老板追问“Claw Code 应该知道哪些内容分给哪个模块吧”。确认口径：必须知道，而且不能靠模型猜。

本轮新增显式模块路由表：

- 新增：`[REDACTED_LOCAL_PATH]`
- 核心类：`ModuleRoutingTable`
- 核心输出：
  - `to_manifest(task)`：结构化 JSON 路由计划
  - `markdown(task)`：人类可读路由说明
  - `plan_course_bundle(task)`：确定性 content_kind → target_module/worker 映射

当前课程成果包明确分配 10 个模块步骤：

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

`CourseProductionRouter` 已接入该路由表：

- 每次成果包运行先输出：
  - `00_module_routing.json`
  - `00_module_routing.md`
- 统一 manifest 中新增 `module_routing` 字段。
- Manifest 记录中新增 `module_routing` step。

路由规则：

- 知识路由先于模块路由。
- course_pack 是后续模块的 canonical source。
- 每个 worker 只收到自己负责的 content_kind + 建木约束。
- 风格不得覆盖结构、事实、可读性、质量门槛。
- preview/final 标签必须服从质量闭环。

已完成校验：

```text
python -m py_compile src\module_routing.py src\router.py
```

最小运行测试：

```text
ROUTES 10
['course_pack', 'ppt_draft', 'video_plan', 'animation_plan', 'localization', 'image_generate', 'office_export', 'music_generate', 'weavemuse_compose', 'edge_tts']
PPTAgent/DeepPresenter via PptDraftWorker
```

## 全功能模块知识网约束接入（2026-05-22 01:52）

老板明确要求：长文分析、调查研究，以及所有功能模块都必须有知识网指导和约束，不能糊弄。

本轮补齐两层：

### 1. 文本/研究知识层

新增目录：

```text
[REDACTED_LOCAL_PATH]
```

新增 5 个文件：

- `research_methodology.md`：调查研究方法论，规定问题定义、概念树、证据等级、反证检查、输出结构。
- `longform_analysis_rules.md`：长文分析规则，规定结构层、概念层、论证层、数据层、风险层和输出层。
- `source_quality_rubric.yaml`：来源可信度与研究质量评分，含 hard_fail 条件。
- `module_constraints.yaml`：WebResearchAdapter、DocAdapterLite、LocalMultimodalFileAdapter、LocalizationWorker、OfficeExportWorker、EdgeTTSWorker 的模块约束。
- `research_prompt_template.md`：调查研究 prompt 模板。

`build_multimodal_knowledge.py` 已接入 `add_text_research_knowledge.py`，重建时不会丢。

### 2. 运行时代码接入

已接入建木约束的新增模块：

- `DocAdapterLite.cloud_analyze()`：长文/文档分析 cloud payload 带 `jianmu_constraints` 和 `constraint_markdown`，返回结果也带约束。
- `WebResearchAdapter.search_and_fetch()`：主动搜索与网页抓取返回建木研究约束。
- `ToolPlanner.web_search`：改用 `search_and_fetch()`，不再只返回裸搜索结果。
- `pipeline.run_course_pack()`：研究简报新增“外部研究约束”。
- `LocalMultimodalFileAdapter.analyze()`：本地文件分析 request JSON 和返回结果带建木约束。
- `LocalizationWorker`：源文本、本地化包、语言包 JSON 带建木约束。
- `OfficeExportWorker`：导出产物新增 `07_office_constraints.md`。
- `EdgeTTSWorker`：TTS 产物新增 `09_tts_constraints.md`，cloud payload 带约束。

`ModuleRoutingTable` 也新增 `functional_module_matrix`，覆盖 11 个一等功能模块：

1. WebResearchAdapter
2. DocAdapterLite
3. LocalMultimodalFileAdapter
4. LocalizationWorker
5. OfficeExportWorker
6. EdgeTTSWorker
7. PptDraftWorker
8. VideoPlanWorker
9. ImageGenerationWorker
10. MusicGenerationWorker/WeaveMuseWorker
11. AnimationPlanWorker

### 校验

```text
python -m py_compile src\prompt_constraints.py src\module_routing.py src\router.py src\pipeline.py src\tool_planner.py src\adapters\doc_adapter.py src\adapters\web_adapter.py src\adapters\localization_worker.py src\adapters\multimodal_worker.py src\local_file_adapter.py
```

通过。

知识网重建与编码检查：

```text
REPAIRED_FIRST_ORDER_ASSOCIATION 2714
ADDED_TEXT_RESEARCH_KNOWLEDGE 5
MULTIMODAL_KNOWLEDGE_REBUILT
FILES 116
BAD_COUNT 0
TEXT_RESEARCH 5
```

## 最后一轮收尾：模块级质量门禁与文件对齐（2026-05-22 02:12）

本轮新增模块级质量门禁，完成最后一层闭环：

```text
知识网确定性路由
→ prompt/constraint 注入
→ content_kind 到模块显式分配
→ 每模块输出契约
→ 每模块质量门禁
→ 统一 manifest / quality report / memory
```

新增运行时代码：

```text
[REDACTED_LOCAL_PATH]
```

新增知识网文件：

```text
[REDACTED_LOCAL_PATH]
```

新增重建脚本：

```text
[REDACTED_LOCAL_PATH]
```

`CourseProductionRouter._write_quality_closure()` 现在会输出：

```text
00_module_quality_gates.json
00_module_quality_gates.md
```

并把模块质量门禁结果写入 `00_quality_report.md` 和质量分。

最终对齐报告：

```text
[REDACTED_LOCAL_PATH]
```

校验：

```text
GATES 14
MODULE_ROUTING_OK True
FILES 117
BAD_COUNT 0
MODULE_QUALITY_EXISTS True
```

说明：全仓编码扫描命中的 3 个旧文件主要是有意记录编码污染检查目标字符（例如 `???/????/�/锟/Ã/Â`），不是本轮新增乱码污染；知识网重建检查 BAD_COUNT=0。

## 文学知识网接入（2026-05-22 02:18）

老板要求补文学部分知识网。本轮新增 `literature/` 目录与 `literature_generation_policy.yaml`，并将文学表达 policy 接入 `prompt_constraints.py`。

文学层定位：影响课程开场、讲稿、叙事、案例改写、视频旁白、PPT 标题、音乐/画面意象，但不得压过事实准确、证据链和正式语境。

新增文件：

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

校验通过：`ADDED_LITERATURE_KNOWLEDGE 7`，`LIT_PRESENT True`，`HAS_LIT True`，`FILES 124`，`BAD_COUNT 0`。
