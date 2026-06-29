# 09 FAME 与知识网扩展协议

本页给外部 Agent 和贡献者看。目标是让任何 Agent 都知道：

- FAME 参数怎么理解。
- 路线怎么评分。
- 失败教训怎么保留。
- 新知识怎么补进知识网。
- 私人工程记忆什么时候能晋升为公共知识。

## 1. FAME 参数

每条 route、关键 edge、lesson 都可以带 FAME 参数：

```json
{
  "mu": 0.55,
  "chi": 0.70,
  "epsilon": 0.80,
  "kappa": 0.75,
  "nu": 0.25,
  "delta": 0.0,
  "rho": 0.60,
  "risk": 0.20
}
```

参数含义：

| 参数 | 含义 | 主要来源 |
| --- | --- | --- |
| `mu` | 路线有效性 | 测试、构建、实机结果 |
| `chi` | 与当前目标和语义的贴合度 | 语言树归一、用户反馈 |
| `epsilon` | 证据强度和可验证性 | 测试证据、权威来源 |
| `kappa` | 可操作性和工具稳定性 | 工具结果、执行成功率 |
| `nu` | 新颖性、联想迁移价值 | 横向类比、探索收益 |
| `delta` | 结果偏差、冲突或失败教训 | 失败签名、人工纠偏 |
| `rho` | 复用稳定性和上下文成本 | 多次复用、上下文预算 |
| `risk` | 安全、许可证、时效或工程风险 | 审核、风险规则 |

## 2. 路线评分

默认评分：

```text
route_score =
  0.22 * mu
+ 0.18 * chi
+ 0.20 * epsilon
+ 0.12 * kappa
+ 0.10 * nu
+ 0.08 * rho
- 0.06 * abs(delta)
- 0.04 * risk
```

Agent 不能只按最高分盲选。还必须检查：

- `project_id`
- `subject`
- `route_id`
- `task_id`
- `context_budget`
- 是否有负值 FAME 教训
- 是否需要 `ProposedAction`
- 是否需要 `ApprovedAction`

## 3. FAME 更新规则

执行后只提交 FAME 更新候选，不直接静默改核心知识网。

建议规则：

- 测试通过、构建通过、用户确认有效：提高 `mu`。
- 路线贴合目标、语义归一准确：提高 `chi`。
- 证据可复现、有权威来源：提高 `epsilon`。
- 工具调用稳定、路径和参数正确：提高 `kappa`。
- 有有效联想迁移或新路线启发：提高 `nu`。
- 失败、冲突、误删风险、用户纠偏：降低 `delta` 或增加负值 lesson。
- 多项目复用稳定、上下文成本低：提高 `rho`。
- 许可证不明、数据过时、高危操作：提高 `risk`。

失败路线不删除，转成：

```text
lesson
warns_against edge
negative FAME route
failure_signature
```

## 4. 知识网扩展层级

新增知识必须先抽象、再具体：

```text
语言树中枢
-> 学科 discipline
-> 二级方向 field
-> 主题簇 topic_cluster
-> 抽象方法 / rule
-> route
-> knowledge_point / content_unit
-> verification
-> lesson
```

不得把长文、全文资料、原始日志、大型图片或视频直接塞进 graph 节点。图谱只保留：

- `id`
- `label`
- `subject`
- `node_type`
- `abstraction_level`
- `summary`
- `source_refs`
- `content_refs`
- `route_refs`
- `fame`

详细内容放：

```text
knowledge/database/content_units.jsonl
knowledge/rules/*.json
knowledge/indexes/*.json
asset_store/**
memory/**
外部数据库或对象存储
```

## 5. 新知识录入最小清单

每次补知识前，Agent 必须生成或检查：

```json
{
  "subject": "agent-tooling",
  "abstraction_level": "L5_operation",
  "canonical_terms": ["tool action contract"],
  "route_id": "route-agent-tool-action-contract",
  "summary": "不超过 120 字的摘要",
  "source_refs": ["source-id-or-url"],
  "content_refs": ["content-unit-id"],
  "verification": ["test/check/evidence"],
  "fame": {
    "mu": 0.55,
    "chi": 0.70,
    "epsilon": 0.80,
    "kappa": 0.75,
    "nu": 0.25,
    "delta": 0.0,
    "rho": 0.60,
    "risk": 0.20
  }
}
```

## 6. KnowledgePatchProposal

Agent 不应直接把新内容写进核心知识网。推荐先生成 proposal：

```json
{
  "kind": "KnowledgePatchProposal",
  "proposal_id": "kp-2026-0001",
  "edition_id": "chinese-open",
  "project_id": "optional-project",
  "subject": "agent-tooling",
  "operation": "add_route | add_rule | add_lesson | update_fame | add_content_ref",
  "target_ids": ["route-agent-tool-action-contract"],
  "language_tree_anchor": "language-tree-hub/tool-action",
  "summary": "本次补充的原因和范围。",
  "source_refs": [],
  "content_refs": [],
  "fame_update": {},
  "license_review": "clear | pending | blocked",
  "review_status": "draft | pending_review | approved | rejected"
}
```

只有 `review_status = approved` 后，才可以写核心知识网。

## 7. 私人工程记忆与公共知识网边界

默认规则：

```text
Project Memory overlay != core knowledge net
```

私人工程记忆只能进入 `memory/**` 或项目 overlay。不能自动污染核心知识网。

晋升为公共知识前必须确认：

- 是否去掉了私人路径、密钥、业务细节。
- 是否能写成通用 route、rule 或 lesson。
- 是否有来源和许可证判断。
- 是否有验证证据。
- 是否保留失败签名或 FAME 更新依据。

## 8. Agent 必须遵守

- 不全量加载知识网。
- 不把长日志塞进上下文。
- 不绕过 `ProposedAction` / `ApprovedAction`。
- 不删除失败路线。
- 不把私人工程 overlay 自动写入核心知识网。
- 不用无来源的 FAME 改动覆盖已有参数。
- 不把许可证不明的全文资料导入开源知识网。

