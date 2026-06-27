# 建木多模态知识网调研来源记录（2026-05-22）

本轮调研目标不是做文献综述，而是把外部专业规律压缩成可执行知识网规则。

## 主要来源

1. Interaction Design Foundation — Design Principles
   - 关键点：设计原则是带弹性的专业判断，不是死规则；核心目标是降低认知负荷、提升可用性、引导感知、提高有效沟通。
   - 入库位置：美术/视觉原则、PPT 版式、UI/成果包审查。

2. Nielsen Norman Group — Visual Hierarchy in UX
   - 关键点：视觉层级通过颜色/对比、尺度、分组/邻近、共同区域建立；如果所有元素都突出，就没有元素突出。
   - 入库位置：美术视觉层级、PPT 质量门槛、截图审查规则。

3. Nielsen Norman Group — F-Shaped Pattern of Reading
   - 关键点：用户常扫描而非逐字阅读；标题、首行、左侧锚点和分层标题影响注意力路径。
   - 入库位置：PPT 页面阅读路径、HTML/文档/网页式成果布局。

4. Nielsen Norman Group — 10 Usability Heuristics
   - 关键点：系统状态可见、贴合现实语言、用户控制、标准一致、错误预防、识别优于回忆、审美与极简、错误恢复。
   - 入库位置：Agent Studio 成果包审查、自动修正协议、界面/交互规则。

5. Microsoft Support — Tips for creating and delivering an effective presentation
   - 关键点：字体可远距离阅读、字号不宜过小、文字要短、图形帮助讲故事、背景一致且不抢戏、文字与背景高对比、正式交付前检查设备与颜色。
   - 入库位置：PPT 字体、字号、图表、背景、投影检查、交付质量门槛。

6. StudioBinder — Film Editing
   - 关键点：剪辑不只是技术拼接，而是影响节奏、氛围、叙事、音乐和观众理解的创作环节。
   - 入库位置：视频/影视剪辑、时间轴、镜头衔接、叙事节奏。

7. Ableton Learning Music
   - 关键点：音乐可以由小型 pattern 组合、变化和组织形成；节奏、旋律、和声、结构不是孤立元素。
   - 入库位置：音乐 pattern、循环、段落、BGM 与旁白协调。

## 入库原则

- 外部来源只作为专业依据，不原文照搬。
- 入库内容必须转成：规则、字段、评价项、修正动作、反例。
- 多模态知识必须能被 Agent / Adapter 读取，不写成散文。


## 第二轮补充来源与吸收点

8. Tableau — What is Data Visualization
   - 关键点：数据可视化是让人看见趋势、异常、模式和关系；错误图表会造成偏见、误读或核心信息丢失。
   - 入库位置：`chart_diagram/data_visualization_advanced.md`、`chart_selection_rules.yaml`。

9. W3C/WCAG 与图像可访问性资料（部分页面受 403 限制，采用通用可访问性原则补入）
   - 关键点：视觉内容必须可读、可理解，不能只依赖颜色；文本/背景对比和图像语义要可审查。
   - 入库位置：字体、色彩、可读性、图片审查。

10. 动效/Material Motion 通用原则（页面抓取受限，采用行业通用动效语义补入）
   - 关键点：动效必须有语义，服务状态变化、层级关系、注意力引导，而非装饰。
   - 入库位置：`animation/motion_language_advanced.md`、`motion_semantics.yaml`。


## 第三轮补充来源与吸收点

11. WebAIM — Contrast and Color Accessibility
   - 关键点：普通文字最低对比度 4.5:1，大字 3:1；不应只靠颜色传递信息；图片中文字也应满足可读性要求。
   - 入库位置：`art/accessibility_rules.md`、`art/accessibility_rules.yaml`、PPT/字幕/图表审查规则。

12. Storyboard / presentation / video storytelling 类资料部分抓取失败或受限，本轮采用行业通用实践补入稳定模板。
   - 关键点：故事板要把目标、画面、旁白、动作、转场绑定；否则视频容易退化为自动播放 PPT。
   - 入库位置：`review_prompts/`、`examples/high_quality_patterns.*`、`production_pipeline/auto_fix_work_orders.md`。
