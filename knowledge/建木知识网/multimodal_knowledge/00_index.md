# 建木多模态知识网

这个知识网负责把语言树中的概念、抽象规律和知识点，连接到多模态表达、工程约束与质量评价。

## 设计原则

1. 语言树为主干。
2. 多模态知识按抽象规律、知识点、表达技法、工程约束、评价标准分层。
3. 所有条目都必须能回连到语言树。
4. 一级联想必须全接上。
5. 音乐、影视、美术、PPT、视频都要专业补齐，不能只做工具说明。
6. 质量门槛硬执行，低于阈值不得进入 final。

## Claw Code 中控入口

Claw Code / Agent Studio 中控启动前必须读取：

- `production_pipeline/claw_code_control_constraints_2026-05-22.md`
- `production_pipeline/claw_code_control_constraints.yaml`

设计系统量化参数入口：

- `design_systems/quantified_design_systems_2026-05-22.md`
- `design_systems/design_system_tokens_index.yaml`
- `design_systems/design_system_semantic_tree.yaml`
- `design_systems/bottom_level_completeness_audit.md`
- `language_tree_links/design_system_first_order_overlay.yaml`
- `language_tree_links/design_system_generation_policy.yaml`

中控硬链路：

```text
确定性知识路由
→ prompt/constraint 注入
→ content_kind 到模块显式分配
→ 每模块输出契约
→ 每模块质量门禁
→ 统一 manifest / quality report / memory
```

任何正式成果不得绕过建木知识网直接自由生成。
