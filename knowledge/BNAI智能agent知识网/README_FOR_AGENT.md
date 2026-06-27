# Agent 调用说明

建木多模态知识网调用顺序：

0. Claw Code / Agent Studio 中控先读取 `production_pipeline/claw_code_control_constraints_2026-05-22.md` 与 `production_pipeline/claw_code_control_constraints.yaml`，确认当前项目状态、模块分工、质量门禁与不可绕过规则。
1. 读取 `knowledge_hierarchy.md`，按“基本概念 -> 一级联想 -> 抽象层 -> 规律层 -> 工具层 -> 表达层 -> 工程约束 -> 质量门 -> 返修层”确定检索顺序，避免把一级联想当平铺素材库乱扫。
2. 读取 `tool_aware_reasoning.md`，判断当前任务的算力梯度、推理梯度、工具层和拓扑复杂度；工具调用必须由知识结构推导，不得随意执行。
3. 读取 `tool_capability_map.yaml`，按任务类型、artifact 类型和失败类型选择候选工具类别、输入输出、失败处理和权限边界。
4. 读取 `language_tree_links/first_order_association.yaml` 找到概念的完整一级联想。
5. 读取 `language_tree_links/abstraction_to_expression.yaml` 判断抽象规律对应的表达形态。
6. 读取 `language_tree_links/multimodal_generation_policy.yaml` 与 `language_tree_links/literature_generation_policy.yaml`，确认知识优先、结构优先、文学表达边界。
7. 若任务涉及 UI、PPT、报告版式、视频信息图、数据看板、视觉风格，读取 `design_systems/quantified_design_systems_2026-05-22.md`、`design_systems/design_system_tokens_index.yaml`、`design_systems/design_system_semantic_tree.yaml`、`design_systems/bottom_level_completeness_audit.md`、`language_tree_links/design_system_first_order_overlay.yaml`、`language_tree_links/design_system_generation_policy.yaml`，按权威设计系统参数落地。
8. 读取对应专业目录：art / narrative / ppt / video / music / film / audio / chart_diagram / animation / literature / text_research / design_systems。
9. 生成成果前先读取 `production_pipeline/quality_score_schema.yaml`、`production_pipeline/module_quality_gates.yaml`、`production_pipeline/reviewer_registry.yaml`、`production_pipeline/review_to_fix_mapping.yaml`、`schemas/review_result_schema.yaml` 与 `schemas/auto_fix_ticket_schema.yaml`。
10. 若 review 未通过，按 `production_pipeline/auto_revision_protocol.md`、`production_pipeline/auto_revision_recipes.yaml`、`production_pipeline/auto_fix_work_orders.md` 生成结构化返修票据；preview 不得晋级 final。
11. 任何 final 输出必须经过质量门槛，且 manifest 中必须保留 reviewer、quality gate、fix ticket 与复审记录。

硬规则：

- 不允许 text-only 直接生成正式多模态成果。
- PPT、视频、音乐、图表必须服务叙事结构。
- 风格必须服从主题，不允许素材库随机套皮。
- 文学性不得压过事实准确、证据链和正式语境。
- 外部网页内容只作为临时证据，不得直接写入知识网。
- 乱码、遮挡、溢出、音画不同步、BGM 压旁白，直接 fail 或自动修正。
- preview 不是 final；fallback 不得伪装正式产物。
- 重 worker 走 sandbox/worker 协议，不嵌入 Gateway 主进程。
