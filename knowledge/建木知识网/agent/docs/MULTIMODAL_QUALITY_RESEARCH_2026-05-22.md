# 建木 Agent Studio 多模态质量问题调研初稿（2026-05-22）

## 结论

当前多模态质量差，核心不是“模型不够多”，而是缺少三类专业知识资产：

1. 内容语义知识：主题事实、案例、政策、课程逻辑、受众画像。
2. 视觉/音视频制作知识：版式、镜头、节奏、字体、色彩、图表、讲授节奏。
3. 质量评价知识：什么是好 PPT、好视频、好讲稿、好图、好课程包，以及如何打分和重写。

所以给 Claw Code / 建木知识网增加专业内容是可行且必要的，但不应只加“资料文档”。应增加结构化的“质量知识库 + 样例库 + 评分规程 + 反例库”。

## 论文依据

### 1. Retrieval-Augmented Multimodal Language Modeling / RA-CM3
- arXiv:2211.12561
- 要点：多模态模型把知识全塞进参数，会导致模型越来越大、训练成本越来越高；外部 memory/retrieval 可以让生成器引用相关文本和图片。
- 结果：RA-CM3 在 MS-COCO 图像和 caption 生成任务上相对基线有明显提升（摘要称 FID + CIDEr 均有提升），且训练计算低于 DALL-E 30%。
- 对建木的启示：多模态生成应接入可检索的案例、图像、版式、知识片段，不应只靠 prompt。

### 2. RAG Survey
- arXiv:2312.10997
- 要点：RAG 解决 LLM 幻觉、知识过期、推理不可追踪问题，并支持领域知识持续更新；RAG 从 naive 走向 advanced / modular。
- 对建木的启示：建木知识网不只是文档仓库，应成为 modular RAG 的外部知识层和质量治理层。

### 3. Visual Instruction Tuning / LLaVA
- arXiv:2304.08485
- 要点：多模态能力来自视觉-语言指令数据与 instruction tuning，不是单纯把图像编码器和 LLM 拼起来。
- 对建木的启示：如果想让 Studio 懂“如何看图/讲图/转课件”，需要建设指令样例与偏好样例。

### 4. Lost in the Middle
- arXiv:2307.03172
- 要点：长上下文模型并不稳定使用中间信息，相关信息在中间时性能会下降。
- 对建木的启示：不能把一堆材料粗暴塞给模型；需要检索、排序、摘要、分块、引用定位。

### 5. PPTAgent / PPTEval
- arXiv:2501.03936
- 要点：PPT 生成不能只评估内容质量，还必须评估视觉吸引力和结构连贯性；PPTAgent 用参考演示文稿抽取 slide-level functional types 和 content schemas，再以 edit-based workflow 生成。
- 对建木的启示：PPT 质量差的根因是缺少参考 PPT、页面功能类型、内容 schema、设计评价器。只靠 Marp 或模板会永远偏“能生成，不好看”。

### 6. DPO / Preference Optimization
- arXiv:2305.18290
- 要点：偏好数据能稳定提升模型行为控制，DPO 比复杂 RLHF 更轻量。
- 对建木的启示：如果老板持续点评“这页好/不好、这个视频水/不水”，应沉淀为偏好样例和评分规则，未来可用于重排/重写/微调。

### 7. Open-FinLLMs
- arXiv:2408.11878
- 要点：金融领域多模态能力受限于领域语料稀缺、弱多模态能力、评价窄；该工作用 52B tokens 金融语料、573K 金融指令、1.43M 多模态 tuning pairs 提升金融文本/表格/时序/图表任务。
- 对建木的启示：财经培训/财务数字化是领域任务，必须建领域数据与图表/表格/政策解释样例库。

## 当前质量差的具体原因

1. 多模态模块大多是 protocol/fallback 级：有接口、有占位产物，但没有高质量生成模型或高质量参考库。
2. 缺少“参考作品库”：没有高质量 PPT/视频/课程/配图的 few-shot reference，模型只能按通用样式猜。
3. 缺少“页面功能类型”：PPT 不知道这页是定义页、框架页、案例页、对比页、流程页、结论页，所以结构扁平。
4. 缺少“视觉 schema”：字体、字号、留白、色彩、图表、版式密度没有系统规则。
5. 缺少“视频导演知识”：没有镜头语言、节奏、转场、配乐、字幕、旁白规范。
6. 缺少“质量评价闭环”：没有自动判定哪些内容水、哪些页面丑、哪些产物不该交付。
7. 检索和上下文组织还粗：材料一多容易 lost-in-the-middle。
8. 老板的偏好还没结构化：老板能判断质量，但系统还没把这些判断沉淀为可复用规则。

## 建议新增的建木专业知识库

### A. 课程内容知识库
- 高校财务干部画像
- 财务数字化主题图谱
- 政策法规摘要
- 典型案例库
- 课堂互动题库
- 讲授金句/类比库

### B. PPT 专业库
- 高质量参考 PPT 样例
- slide function taxonomy：封面、目录、概念、框架、流程、案例、数据、对比、结论、行动清单
- 每类页面 content schema
- 色彩/字体/版式规范
- 反例库：拥挤、空泛、标题党、图文不符、无层级

### C. 视频导演库
- 课程视频镜头模板
- 旁白节奏规范
- 字幕规范
- B-roll/素材建议
- 开场/转场/结尾模板
- 音乐情绪标签

### D. 图片/图表库
- 财经/治理/数字化图标库
- 流程图 schema
- 因果图 schema
- 时间线 schema
- 组织架构/能力模型 schema

### E. 质量评价库
- PPTEval-style 三维评价：Content / Design / Coherence
- 视频评价：Narrative / Visual / Audio / Timing / Pedagogy
- 讲稿评价：准确性 / 结构 / 案例 / 课堂感 / 受众适配
- 老板偏好样例：好/坏/为什么/如何改

## 可行性判断

可行，而且是当前最该做的方向。原因：

1. 不需要训练大模型即可先提升：先用 RAG、reference selection、schema-guided generation、critique-refine 即可。
2. 与建木知识网天然匹配：知识网本来就是外部 memory，适合做 modular RAG。
3. 与 Claw Code 适配：Claw Code 可以按文件协议读取 schema、examples、rubrics，并调度生成/评价/重写。
4. 形成可积累资产：每次老板点评、每个好作品、每个失败案例都能沉淀。
5. 避免供应商锁定：即使换模型，质量知识库仍保值。

## 推荐下一步

先别急着调模型。先建立 `quality_knowledge/`：

```text
quality_knowledge/
  ppt/
    slide_types.yaml
    design_rubric.md
    examples_good/
    examples_bad/
  video/
    director_rubric.md
    shot_templates.yaml
    narration_rhythm.md
  course/
    pedagogy_rubric.md
    audience_profiles.md
    case_library.md
  multimodal/
    prompt_patterns.md
    reference_selection.md
    evaluation_protocol.md
  preference/
    boss_feedback.jsonl
```

然后在 pipeline 中加入：

1. 先检索专业知识库。
2. 再生成初稿。
3. 再按 rubric 自动评价。
4. 不达标自动重写。
5. 最后才进入 PPT/视频/图像渲染。
