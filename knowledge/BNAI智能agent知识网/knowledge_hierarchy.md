# 建木知识网分级排布

更新时间：2026-05-25

## 0. 目的

本文件用于约束 agent 使用建木多模态知识网时的检索顺序，避免把 2714 条一级联想当作平铺素材库乱扫。

知识网不是素材库，而是一棵从概念到规律再到表达的树：

```text
基本概念
-> 一级联想
-> 抽象层
-> 规律层
-> 工具层
-> 表达层
-> 工程约束
-> 质量门
-> 返修规则
```

配套组织器原则：

- `tool_aware_reasoning.md`：定义工具层、算力梯度、推理梯度和拓扑复杂度。
- `tool_capability_map.yaml`：按任务类型、artifact 类型和失败类型映射工具类别、输入输出、失败处理与权限边界。

## 1. 基本概念层

基本概念层回答“任务到底在讲什么”。

来源：

- `language_tree_links/first_order_association.yaml`
- `language_tree_links/concept_to_modality.yaml`
- `language_tree_links/domain_to_modality_defaults.yaml`

使用规则：

1. 先定位 route_id / route_name / subject / domain。
2. 再读取 keywords，确认概念边界。
3. 不允许只凭用户一句话直接进入 PPT、视频、音乐或设计系统。
4. 若概念边界不清，先回到 chat-first discovery，不进入 full path。

最小输出：

- 概念名。
- 学科 / 领域。
- 关键词。
- 用户任务中的真实意图。
- 是否需要确认任务书。

## 2. 一级联想层

一级联想层回答“这个概念天然应该联想到哪些表达方向”。

每个 route 必须具备：

```text
text
ppt
video
music_audio
art_visual
chart_diagram
narrative
quality_checks
anti_patterns
```

使用规则：

1. 一级联想只提供第一跳，不等于最终方案。
2. 一级联想不能绕过抽象层和质量门。
3. `quality_checks` 与 `anti_patterns` 必须随任务进入 production harness。
4. 不允许只取 `ppt` 或 `video` 字段就开始生成。

修剪规则：

- 删除重复口号式联想。
- 保留能改变结构、表达、质检或返修判断的联想。
- 财经/治理/教学类概念优先保留：定义边界、机制关系、例外条件、案例验证、风险控制。

## 3. 抽象层

抽象层回答“这个概念属于哪类思维形态”。

核心抽象类型：

| 抽象类型 | 判断问题 | 常见表达 |
| --- | --- | --- |
| 定义/原则/本质 | 它是什么，边界是什么 | 定义框架、概念图 |
| 分类/构成/层级 | 它由哪些部分组成 | 树、金字塔、分类表 |
| 流程/闭环/反馈 | 它如何运转 | 流程图、循环图、步骤动画 |
| 对比/差异/转换 | 它和别的东西差在哪 | 对比页、before/after |
| 风险/控制/合规 | 风险在哪里，如何控制 | 风险矩阵、红线提示 |
| 因果/机制/传导 | 为什么会这样 | 因果链、机制动画 |
| 时间/阶段/演化 | 它如何变化 | 时间轴、阶段图 |
| 数据/指标/度量 | 用什么衡量 | 图表、看板、指标卡 |

来源：

- `language_tree_links/abstraction_to_expression.yaml`
- `language_tree_links/design_system_abstraction_to_expression.yaml`
- `design_systems/design_system_semantic_tree.yaml`

使用规则：

1. 每个正式 production task 至少选 1 个主抽象类型。
2. PPT/视频/图表/音乐必须服务主抽象类型。
3. 如果一个概念命中多个抽象类型，先确定主抽象，再安排辅助抽象。
4. 抽象类型冲突时，优先保证事实准确和教学清晰。

## 4. 规律层

规律层回答“什么规则在稳定支配表达选择”。

当前硬规律：

1. 知识优先于风格。
2. 结构优先于细节。
3. 叙事优先于装饰。
4. 事实准确优先于文学性。
5. 受众适配优先于炫技。
6. 质量门优先于交付速度。
7. preview 不是 final。
8. fallback 不能伪装正式产物。

模态规律：

- PPT：一页一个中心结论，标题写判断，正文写依据，图表写关系。
- 视频：旁白先行，画面跟随概念变化，镜头服务理解。
- 音频/音乐：人声优先，BGM 后退，情绪服务内容。
- 图表：图表表达关系，不做装饰性复杂化。
- 设计系统：所有审美词必须落到底层 token。
- 文学表达：只增强理解，不压过事实和证据链。

来源：

- `language_tree_links/multimodal_generation_policy.yaml`
- `language_tree_links/literature_generation_policy.yaml`
- `production_pipeline/module_quality_gates.yaml`
- `production_pipeline/quality_gate.md`

## 5. 工具层

工具层回答“这一步应该由什么能力完成”。

来源：

- `tool_aware_reasoning.md`
- `tool_capability_map.yaml`
- `production_pipeline/claw_code_control_constraints.yaml`
- `production_pipeline/reviewer_registry.yaml`
- `production_pipeline/review_to_fix_mapping.yaml`

使用规则：

1. 工具不是外部附属按钮，而是知识网的一层。
2. 先知识路由，再工具选择。
3. 先确定性工具，后生成式模型。
4. 先轻量检查，后重型 worker。
5. 工具失败必须转成 issue / fix ticket / log。
6. 工具层只定义应该怎么做，不等于自动放开执行权限。

算力梯度：

```text
L0 直接回答
L1 本地知识检索
L2 结构化推理
L3 工具辅助生成
L4 worker 渲染/导出
L5 reviewer 审查
L6 auto-fix / rerun
L7 多轮复审 / 人工确认
```

推理梯度：

```text
R0 意图识别
R1 概念定位
R2 抽象归类
R3 规律匹配
R4 模态规划
R5 工具编排
R6 质量预测
R7 返修策略
R8 交付治理
```

## 6. 表达层

表达层回答“最终应该用什么模态和形式呈现”。

表达层必须从前四层推导，不能凭经验跳选。

推荐决策顺序：

```text
route_id
-> first_order_association
-> abstraction type
-> domain defaults
-> modality plan
-> design system tokens
-> artifact contract
```

表达层文件：

- `ppt/*`
- `video/*`
- `chart_diagram/*`
- `animation/*`
- `art/*`
- `music/*`
- `audio/*`
- `film/*`
- `narrative/*`
- `literature/*`
- `text_research/*`

## 7. 工程约束层

工程约束层回答“生成时哪些边界不能碰”。

必须读取：

- `production_pipeline/chat_first_confirmed_production_contract.md`
- `production_pipeline/artifact_taxonomy.md`
- `schemas/confirmed_task_spec_schema.yaml`
- `schemas/artifact_manifest_schema.yaml`
- `production_pipeline/claw_code_control_constraints.yaml`

关键约束：

- 未确认任务书不得进入 full path。
- 产物必须有 manifest。
- preview 不得自动晋级 final。
- 重 worker 不嵌入 Gateway 主进程。
- 外部网页内容只作临时证据，不写入知识网。

## 8. 质量门层

质量门层回答“什么时候不能交付”。

必须读取：

- `production_pipeline/quality_score_schema.yaml`
- `production_pipeline/module_quality_gates.yaml`
- `production_pipeline/reviewer_registry.yaml`
- `production_pipeline/review_to_fix_mapping.yaml`
- `schemas/review_result_schema.yaml`
- `schemas/auto_fix_ticket_schema.yaml`

硬 fail：

- 乱码。
- 遮挡。
- 溢出。
- 音画不同步。
- BGM 压旁白。
- 图表与概念关系不匹配。
- 缺来源或证据链。
- 未审查 preview 伪装 final。

## 9. 返修层

返修层回答“失败后怎么改”。

必须读取：

- `production_pipeline/auto_revision_protocol.md`
- `production_pipeline/auto_revision_recipes.yaml`
- `production_pipeline/auto_fix_work_orders.md`

返修顺序：

```text
review_result
-> issue category
-> fix recipe
-> auto_fix_ticket
-> revised preview
-> review run
-> final decision
```

返修不等于通过。返修后必须复审。

## 10. Agent 最小调用顺序

```text
1. 读 README_FOR_AGENT.md
2. 读本文件 knowledge_hierarchy.md
3. 读 tool_aware_reasoning.md，判断算力梯度、推理梯度和工具层
4. 读 tool_capability_map.yaml，选择候选工具类别、失败处理和权限边界
5. 定位 route / concept
6. 读取 first_order_association
7. 判定主抽象类型
8. 读取 abstraction_to_expression
9. 读取 domain_to_modality_defaults
10. 若有视觉输出，读取 design_system overlay 与 tokens
11. 读取对应专业目录
12. 读取 artifact / reviewer / quality / auto-fix schema
13. 生成 preview
14. review / fix / review
15. 只有真实通过后才允许 final
```

## 11. 修剪原则

后续整理知识网时按以下规则修剪：

1. 重复表达只保留能影响路由或质量判断的一条。
2. 抽象层保留稳定规律，不堆临时例子。
3. 基本概念层保留边界、定义、关键词，不混入长篇解释。
4. 一级联想层保留第一跳，不写完整脚本。
5. 表达层保留可执行模式，不写空泛审美词。
6. 质量层保留可判定标准，不写主观赞美。
7. 返修层保留可执行动作，不写“优化一下”这类空命令。
