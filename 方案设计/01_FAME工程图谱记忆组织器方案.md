# FAME 工程图谱记忆组织器方案

版本：v0.1 草案  
定位：面向工程进度同步、知识网全局控制、抽象联想创造、工具调用防错的动态路由记忆系统

产品形态补充：本项目应做成 `Agent 万用外部插件 / 外脑运行时 / 工具治理网关`，而不是只服务某一个工程的内置模块。任何 agent、IDE、CLI、工作流系统都可以通过 MCP/API 接入，由本系统提供知识路由、FAME 动态状态、工具治理、上下文健康、审计和可视化补充入口。

## 1. 核心判断

这个系统不应被设计成普通 RAG、普通 agent memory 或普通工程检索库。它的核心是：

```text
工程现场状态
+ 建木知识网思考链
+ FAME 动态路由参数
= 可随工程进度更新的图谱记忆组织器
```

建木知识网已经有稳定链路：

```text
基本概念 -> 一级联想 -> 抽象层 -> 规律层 -> 工具层 -> 表达层
-> 工程约束 -> 质量门 -> 返修规则
```

FAME 要接入的不是单个知识点，而是这条链上的“关系”和“路线”。工程里真正会变的不是“某个概念是否存在”，而是：

- 这个知识点在当前项目阶段是否仍适用。
- 这条路线最近是否成功。
- 这个工具在当前工程状态下是否可靠。
- 某个抽象判断和工程现实是否冲突。
- 某条失败路线是否应变成教训，而不是继续重试。
- 哪些内容需要进入上下文，哪些只保留日志和摘要。

因此，本系统的最小核心不是 `MemoryNode`，而是：

```text
FAMEEdgeState
```

即：每条知识关系、工程关系、工具关系，都带有 FAME 状态。

## 2. 设计目标

1. 按工程进度记录：记录任务、代码、工具调用、失败、修复、质量门、manifest、阶段摘要。
2. 结合知识网全局控制：所有正式工具调用必须先经过知识路由、抽象判型、规律匹配、工程约束和权限边界。
3. 保留抽象与联想创造能力：不把一级联想当素材库，而是作为第一跳，再进入抽象、规律、表达和工程约束。
4. 避免上下文膨胀：按科目、按项目、按任务、按路线按需遍历；解决完问题后只把摘要、证据链、FAME 更新写入长期图谱。
5. 防止工具调用出错：工具不是按钮，而是知识网的一层；每次调用都要有目的、输入、输出、失败处理和权限判断。
6. 支持实时真实性：知识关系随时间、工程状态、成功/失败反馈而更新，不把过去正确的路线永远当成当前正确。
7. 做成 agent 万用外部插件：以 MCP Server、HTTP API、CLI adapter、IDE adapter 的形式接入不同 agent。
8. 模块化可调试：每个模块必须暴露 health、trace、dry-run、explain、replay 接口。
9. 知识网可视化和补充：提供 route/edge/FAME/日志摘要的可视化浏览、编辑建议、补充入口和审核流程。
10. 每次开始工作前必须执行文档对齐协议，避免 agent 根据旧上下文或局部记忆工作。

## 3. 可借鉴开源项目

外部项目适合作为基础设施，但 FAME 路由层需要自研。

| 项目 | 可借鉴部分 | 在本系统中的位置 |
|---|---|---|
| Graphiti / Zep | 时间知识图谱，事实随时间变化，保留来源和时间线 | Temporal Memory Store |
| codebase-memory-mcp | 用 Tree-sitter/MCP 把代码库索引成函数、类、调用链、HTTP route 图谱 | Project Code Graph |
| LangGraph | 状态机、工具编排、短期/长期 memory、human-in-the-loop | Orchestration Runtime |
| MCP | 统一暴露本地文件、数据库、工具、工作流 | Tool/Resource Boundary |
| Neo4j / Memgraph / SQLite graph | 图查询、关系存储、路径遍历 | Runtime Graph DB |

关键结论：不要让这些项目替代建木知识网。它们只负责承载、同步、查询和执行。真正的路线判断来自：

```text
建木知识网层级 + FAMEEdgeState + 工程现场反馈
```

## 4. FAME 参数工程化定义

论文中 AI emotion vector 为：

```text
E_AI = (mu, chi, epsilon, kappa, nu, delta, rho, lambda)^T
```

工程路由转译：

| 参数 | 原始含义 | 工程路由含义 | 上升信号 | 下降信号 |
|---|---|---|---|---|
| mu | Satisfaction / goal achievement | 路线有效性、正反馈 | 工具成功、质量门通过、用户确认有效 | 失败、返修、目标未达 |
| chi | Curiosity / exploration | 探索价值、联想潜力 | 新路径、新抽象、新问题类型 | 重复、无收益、已稳定 |
| epsilon | Empathy / alignment | 与用户目标、项目风格、知识网语义一致 | 用户确认、符合任务书、符合领域风格 | 偏题、风格不符、误解意图 |
| kappa | Confidence | 置信度、可执行可靠性 | 证据充分、历史成功、低冲突 | 缺证据、工具报错、过期 |
| nu | Anxiety / uncertainty | 风险与不确定性 | 未知路径、外部依赖、权限风险、时效风险 | 验证通过、风险解除 |
| delta | Conflict | 逻辑冲突、知识冲突、工程状态冲突 | 规则互斥、测试矛盾、版本冲突 | 冲突消解、规则合并 |
| rho | Fatigue | 资源压力、上下文压力、维护压力 | token 过大、构建慢、工具链重、重试多 | 摘要压缩、缓存命中、轻量路径 |
| lambda | Frustration | 持续失败记忆、教训权重 | 同类失败、返修未过、用户否定 | 修复成功、路线替换 |

## 5. FAMEEdgeState Schema

```yaml
FAMEEdgeState:
  edge_id: string
  source_id: string
  target_id: string
  relation_type: supports|requires|routes_to|uses_tool|fails_as|fixes_by|summarizes_to
  scope:
    project_id: string
    subject: string
    domain: string
    route_id: string
    task_id: string
  fame:
    mu: float        # effectiveness
    chi: float       # exploration value
    epsilon: float   # alignment
    kappa: float     # confidence
    nu: float        # uncertainty/risk
    delta: float     # conflict
    rho: float       # resource/context pressure
    lambda: float    # persistent frustration/lesson
  dynamics:
    xi: float        # inertia
    freshness: float # time validity
    last_updated_at: datetime
    half_life_days: float
  evidence:
    success_count: int
    failure_count: int
    conflict_count: int
    lesson_count: int
    source_refs: list
    log_refs: list
    summary_ref: string
  governance:
    permission_required: bool
    quality_gate_required: bool
    human_confirm_required: bool
    final_allowed: bool
```

## 6. FAME 更新公式

### 6.1 事件反馈向量

每次工程事件生成反馈：

```text
r_t = (r_mu, r_chi, r_epsilon, r_kappa, r_nu, r_delta, r_rho, r_lambda)
```

示例：

```text
工具成功:
r = (+0.20, 0, +0.05, +0.15, -0.10, -0.05, 0, -0.10)

工具失败:
r = (-0.15, +0.05, -0.05, -0.20, +0.20, +conflict, +resource, +0.20)

用户确认方向正确:
r = (+0.10, 0, +0.25, +0.10, -0.05, 0, 0, -0.05)

发现新抽象联想:
r = (0, +0.25, +0.05, 0, +0.05, 0, +0.05, 0)
```

### 6.2 惯性更新

FAME 不应因一次事件剧烈波动。使用论文中的惯性思想：

```text
E_t = clip(E_{t-1} + (1 - xi) * r_t, 0, 1)
```

其中：

- `xi` 高：核心规律、稳定知识、长期工程约束。
- `xi` 中：工具经验、模块经验、项目习惯。
- `xi` 低：临时 API 状态、当前文件状态、一次性工具可用性。

建议默认值：

```text
知识硬规律 xi = 0.85 - 0.95
抽象判型 xi = 0.70 - 0.85
工具路线 xi = 0.45 - 0.70
工程实时状态 xi = 0.15 - 0.45
外部网页证据 xi = 0.10 - 0.30
```

### 6.3 新鲜度衰减

知识和工程状态有时效性：

```text
freshness(t) = exp(-(now - last_verified_at) / half_life)
```

有效置信度：

```text
kappa_eff = kappa * freshness * evidence_factor * conflict_penalty
```

其中：

```text
evidence_factor = 1 - exp(-evidence_count / c)
conflict_penalty = 1 / (1 + delta + unresolved_conflicts)
```

### 6.4 路由评分

一条候选路线的总评分：

```text
Score(route) =
  w_mu * mu
+ w_chi * chi
+ w_epsilon * epsilon
+ w_kappa * kappa_eff
- w_nu * nu
- w_delta * delta
- w_rho * rho
- w_lambda * lambda
+ w_quality * quality_gate_fit
+ w_scope * subject_scope_fit
```

默认权重：

```yaml
weights:
  mu: 0.18
  chi: 0.08
  epsilon: 0.14
  kappa: 0.22
  nu: 0.12
  delta: 0.16
  rho: 0.06
  lambda: 0.12
  quality_gate_fit: 0.18
  subject_scope_fit: 0.16
```

### 6.5 冲突触发

若满足任一条件，进入审查或人工确认：

```text
delta > 0.65
nu > 0.75 and kappa_eff < 0.45
lambda > 0.70 and failure_count >= 3
rho > 0.80 and task requires heavy worker
permission_required = true
```

## 7. 按需遍历与上下文健康

### 7.1 图遍历原则

不要全量读取知识网。遍历顺序：

```text
用户意图
-> 科目 / 领域 / route_id 定位
-> 一级联想第一跳
-> 主抽象类型
-> 规律层
-> 工具层
-> 工程约束
-> 质量门
-> 最近相关日志摘要
-> 必要时展开原始日志
```

### 7.2 上下文预算

每轮任务上下文分四层：

| 层 | 内容 | 是否进入上下文 |
|---|---|---|
| L0 当前意图 | 用户目标、任务阶段、关键约束 | 必进 |
| L1 路由摘要 | 相关 route、抽象、工具、质量门摘要 | 必进 |
| L2 证据摘要 | 最近成功/失败/冲突/修复摘要 | 按需进 |
| L3 原始日志 | 完整工具输出、长文档、历史过程 | 默认不进，需要时调取 |

### 7.3 问题解决后的上下文释放

任务完成后，不把全过程留在上下文，而写入：

```text
TaskRunLog
ToolInvocationLog
FailureCase
FixTicket
RouteSummary
FAMEEdgeState update
```

长期只保留摘要：

```yaml
summary:
  problem: string
  route_used: list
  abstraction_used: list
  tools_used: list
  success_or_failure: enum
  key_evidence: list
  lessons: list
  fame_delta: object
  next_time_hint: string
```

## 8. 工程进度同步模型

项目不是一个目录，而是一个随时间演化的现场：

```yaml
ProjectRun:
  project_id: string
  current_phase: discovery|design|implementation|test|review|delivery|maintenance
  active_tasks: list
  changed_files: list
  active_routes: list
  active_constraints: list
  context_budget:
    max_tokens: int
    current_tokens_estimate: int
    compression_required: bool
  health:
    build_status: pass|fail|unknown
    test_status: pass|fail|unknown
    tool_status: degraded|normal|blocked
```

每次工程事件：

```text
file_changed / test_run / tool_called / review_failed / fix_applied / user_confirmed
```

都会更新：

```text
工程图谱关系 + FAMEEdgeState + 摘要日志
```

## 9. 执行状态机

推荐用 LangGraph 或自研轻量状态机承载：

```text
R0 意图识别
R1 route 定位
R2 抽象判型
R3 FAME 路线评分
R4 上下文裁剪
R5 工具候选
R6 权限/质量门检查
R7 执行
R8 结果审查
R9 FAME 更新
R10 日志摘要写回
```

注意：状态机不是大脑。大脑是：

```text
建木知识网 + FAME 动态路线状态 + 工程现场反馈
```

## 10. 完整版建设建议

本项目不建议做简化版。简化版若只做 memory、检索或工具日志，会丢失系统真正的差异性。完整系统应一次性建立主干能力：

```text
建木知识路由
+ 工程现场图谱
+ FAME 动态边状态
+ 工具治理
+ 质量门
+ 返修闭环
+ 上下文健康
+ 日志摘要与评估
```

工程实施可以分阶段，但核心 schema、事件链和闭环必须一次性设计完整。

### 10.1 核心模块

1. `knowledge_router`
   - 读取建木 `knowledge_hierarchy.md`、`tool_aware_reasoning.md`、`tool_capability_map.yaml`。
   - 根据 `project_id / subject / domain / route_id` 按需取子图。
   - 输出 route summary、abstraction summary、tool policy summary。

2. `project_sync_indexer`
   - 扫描工程目录、文件、模块、脚本、测试、manifest、日志。
   - 建立 `ProjectEntity`、`ProjectRun`、`ToolInvocationLog`。
   - 可接 `codebase-memory-mcp` 或 Tree-sitter 代码图谱。

3. `fame_edge_store`
   - 存储 `FAMEEdgeState`。
   - 支持事件反馈、惯性更新、新鲜度衰减、路由评分、冲突熔断。
   - 记录所有 FAME delta，方便复盘。

4. `tool_governance`
   - 将工具纳入知识网工具层。
   - 每次工具调用前只按 `tool_id` 临时读取工具说明书，不把工具调用细节常驻上下文。
   - 检查目的、输入、输出、权限、风险、失败处理。
   - 调用结束后只保留调用摘要、结果摘要、失败分类和 FAME delta。
   - 支持 MCP 工具、文件工具、执行工具、reviewer、auto-fix。

5. `quality_gate_engine`
   - 接入已有 `artifact_manifest_schema.yaml`、`review_result_schema.yaml`、`auto_fix_ticket_schema.yaml`。
   - preview 默认不能 final。
   - 质量门失败自动生成 fix ticket。

6. `context_health_manager`
   - 只把当前任务需要的 route 摘要、FAME 摘要、最近日志摘要送入上下文。
   - 控制 token 预算、raw log 展开数量、route shard top-k。
   - 任务完成后释放上下文，保留日志和摘要。

7. `summary_memory_writer`
   - 写入 `context_summary`、`route_summary`、`failure_summary`、`fame_update_summary`。
   - 摘要可检索，原始日志可追溯。

8. `evaluation_harness`
   - 采集 tool success rate、failure recurrence、context token saving、route hit quality、quality gate pass rate。
   - 做 A/B 或历史基线对比。

9. `agent_clock_scheduler`
   - 允许 agent 为长任务、易中断任务、等待外部状态的任务设置提醒和恢复点。
   - 定时检查 project_run、pending_fix_ticket、stale_route、failed_tool_pattern。
   - 根据历史记忆触发自我迭代：更新摘要、调整 FAME 权重、提出 route 修剪建议。

10. `enforcement_kernel`
   - 强制 agent 遵守建木路由、FAME 评分、scope、工具说明书、权限边界、质量门。
   - LLM 不能直接执行工具，只能提交 `ProposedAction`。
   - 所有工具调用必须通过 state、scope、route、manual、FAME、permission、quality 检查。
   - 未通过则返回阻断原因、需要补读的说明书或人工确认请求。

### 10.2 一次性设计、分层落地

完整版不是所有 UI 和自动化都第一天完成，而是：

```text
schema 一次到位
事件链一次到位
FAME 更新一次到位
日志摘要一次到位
质量门一次到位
```

可以延后的是：

```text
高级可视化 UI
复杂自动评估面板
跨项目大规模对比
云端同步
多用户权限系统
```

不应延后的是：

```text
FAMEEdgeState
scope indexing
tool governance
context health
quality/fix loop
summary memory
evaluation events
agent clock / reminder / resume loop
enforcement kernel
```

## 10.3 一次性工具说明书策略

工具调用逻辑不应长期堆在上下文中。现代大模型通常知道“工具是什么”，真正容易出错的是：

- 当前环境的工具 schema。
- 参数名。
- 权限边界。
- 文件路径边界。
- 失败后的处理方式。
- 当前项目的质量门和禁止操作。

因此工具系统应采用：

```text
Tool Summary 常驻
+ Tool Manual 按需读取
+ Tool Invocation 一次性执行
+ Tool Result 摘要写回
```

### Tool Manual Registry

```yaml
ToolManual:
  tool_id: string
  tool_class: file_tool|local_search_tool|exec_tool|browser_tool|reviewer_tool|auto_fix_tool|communication_tool|scheduler_tool
  when_to_use: string
  required_inputs: list
  output_contract: list
  permission_boundary: list
  common_failures: list
  failure_handling: list
  examples_ref: path
  last_verified_at: datetime
```

上下文里默认只进入：

```text
tool_id
tool_class
one_line_capability
permission_boundary_summary
```

真正调用前才读取完整说明书：

```text
route -> candidate tool -> read manual -> validate args -> call -> summarize -> release manual
```

调用后写入：

```yaml
ToolCallSummary:
  tool_id: string
  purpose: string
  args_summary: string
  result_status: success|fail|blocked
  result_summary: string
  failure_category: string
  fame_delta: object
  manual_version: string
```

这能避免上下文被工具命令、schema、失败输出长期占满。

## 10.4 Agent 时钟、提醒与自我迭代

系统需要 agent 自己设定时钟，避免长任务中断、遗忘等待事项或反复踩坑。

### ClockEvent

```yaml
ClockEvent:
  event_id: string
  project_id: string
  task_id: string
  trigger_at: datetime
  repeat_policy: none|interval|cron
  reason: string
  resume_context_ref: string
  action:
    type: check_status|resume_task|review_stale_route|rerun_failed_check|summarize_logs|recalibrate_fame
    target_ref: string
  safety:
    requires_human_confirmation: bool
    max_retries: int
```

### Reminder 类型

```text
任务恢复提醒：长任务被打断后恢复。
等待状态提醒：等待用户、构建、外部下载、定时检查。
陈旧路线提醒：route freshness 过低时重新验证。
失败复发提醒：lambda 高的失败模式定期回顾。
摘要压缩提醒：日志过长时自动生成更短 context_summary。
FAME 校准提醒：根据近期成功率调整权重或惯性。
```

### 自我迭代循环

```text
collect recent logs
-> compute metrics
-> detect repeated failures / high rho / high delta
-> update FAMEEdgeState
-> propose route pruning or tool manual correction
-> write reflection summary
```

自我迭代不能直接修改核心规则，除非满足权限策略：

```text
低风险：写 reflection summary / 调整临时权重
中风险：提出 route 修剪建议
高风险：修改主知识网、工具权限、质量门，必须人工确认
```

## 10.5 强制执行机制：防止大模型偷懒

必须假设大模型会倾向于省略流程、凭经验调工具、跳过说明书、把 preview 当 final、忽略失败日志。因此需要一个不可绕过的 `Enforcement Kernel`。

### 核心原则

```text
LLM 不直接调用工具。
LLM 只能提出 ProposedAction。
Enforcement Kernel 决定是否允许执行。
Tool Gateway 只接受签名后的 ApprovedAction。
```

### ProposedAction

```yaml
ProposedAction:
  action_id: string
  project_id: string
  task_id: string
  route_id: string
  phase: string
  intended_tool_id: string
  purpose: string
  expected_inputs: object
  expected_outputs: list
  artifact_kind: string
  risk_acknowledgement: list
  required_context_refs: list
```

### ApprovedAction

```yaml
ApprovedAction:
  action_id: string
  approved: boolean
  approval_token: string
  allowed_tool_id: string
  allowed_args: object
  policy_checks:
    state_check: pass|fail
    scope_check: pass|fail
    route_check: pass|fail
    manual_check: pass|fail
    fame_check: pass|fail
    permission_check: pass|fail
    context_budget_check: pass|fail
    quality_gate_check: pass|fail
  blocked_reason: string
  required_next_step: read_manual|narrow_scope|ask_human|summarize_context|review_first|fix_first
```

### 强制检查顺序

```text
1. State Machine Check
   当前阶段是否允许这个动作。

2. Scope Check
   是否带 project_id / subject / route_id / task_id。

3. Knowledge Route Check
   是否经过建木知识路由、抽象判型、规律匹配。

4. Tool Manual Check
   是否读取了对应 tool_id 的当前说明书版本。

5. FAME Check
   kappa_eff 是否足够，delta/nu/lambda/rho 是否触发熔断。

6. Permission Check
   是否触碰外发、删除、真实模型、跨边界写入、启动停止服务等权限。

7. Context Health Check
   是否超预算，是否应该先摘要而非继续展开。

8. Quality Gate Check
   是否把 preview 当 final，是否需要 reviewer 或 fix ticket。

9. Approval Token
   只有全部通过，生成一次性 approval_token。
```

### Tool Gateway

工具网关只执行：

```text
ApprovedAction + approval_token
```

不接受：

```text
LLM 直接命令
未带 route_id 的工具调用
未读 manual 的工具调用
高风险但无人确认的工具调用
preview 直接进入 final
```

### Policy-as-Code

关键规则应写成机器可执行策略，而不是只写在 prompt 里：

```yaml
policy:
  require_scope: true
  require_route_before_tool: true
  require_manual_before_tool: true
  require_quality_gate_before_final: true
  deny_destructive_without_human: true
  deny_external_write_without_human: true
  deny_tool_when_context_over_budget: conditional
  deny_when_delta_high: conditional
```

可借鉴 OPA/Rego、JSON Schema、Pydantic/Zod validator、LangGraph state transition guard、OpenAI Agents SDK guardrails 的思想。

### Audit Trail

每次阻断和放行都必须写入审计：

```yaml
EnforcementAudit:
  action_id: string
  proposed_by: llm|scheduler|human
  policy_version: string
  checks: object
  approved: boolean
  blocked_reason: string
  approval_token_hash: string
  timestamp: datetime
```

这个审计记录用于：

- 发现模型偷懒模式。
- 统计被阻断的危险动作。
- 迭代工具说明书和 route policy。
- 校准 FAME 风险参数。

## 11. 推荐目录结构

```text
fame_graph_memory/
  config/
    weights.yaml
    traversal_policy.yaml
    permission_policy.yaml
  schemas/
    fame_edge_state.yaml
    project_run.yaml
    route_summary.yaml
    tool_invocation_log.yaml
  src/
    knowledge_router/
    project_sync/
    fame_dynamics/
    context_health/
    tool_governance/
    summary_writer/
  data/
    graph/
    logs/
    summaries/
    fame_snapshots/
  docs/
    architecture.md
    formulas.md
    mermaid/
```

## 12. 与现有知识网的连接点

已有文件应作为启动协议：

```text
README_FOR_AGENT.md
knowledge_hierarchy.md
tool_aware_reasoning.md
tool_capability_map.yaml
production_pipeline/claw_code_control_constraints.yaml
schemas/artifact_manifest_schema.yaml
schemas/confirmed_task_spec_schema.yaml
```

新增 FAME 层不替代这些文件，而是在每次路由时加一层动态判断：

```text
静态知识规则能不能指导当前工程？
当前工程反馈是否支持这条路线？
这条路线是否过期、冲突、资源过重或多次失败？
```

## 13. 结论

该系统的独创性在于：

```text
知识网负责大局观和抽象联想
工程图谱负责实时现场
FAME 负责路线状态和动态真实性
质量门负责交付边界
日志摘要负责上下文健康
```

这不是给 agent 加记忆，而是给工程组织器加“可调、可审、可遗忘、可复盘”的动态路由生命体。

## 14. 与现有开源方案的明显差异性

现有开源方向大致分为四类：

1. temporal graph memory：强调事实随时间变化，如 Graphiti/Zep。
2. agent memory store：强调用户偏好、长期记忆、低 token 检索，如 Mem0、LangGraph store。
3. GraphRAG：强调文档图谱、community summary、local/global search。
4. code graph / MCP：强调代码库结构索引和工具暴露。

本系统要避免同质化，差异点必须落在以下四个方面：

### 14.1 FAME 动态边状态，而不是静态事实记忆

普通 memory 记录：

```text
用户喜欢 X
项目用了 Y
工具 Z 上次失败
```

本系统记录：

```text
知识路线 A -> 工具 B 在 project_id=P、subject=S、route_id=R 下的当前可用性
```

并用 FAME 参数描述这条关系的动态状态：

```text
有效性、探索价值、目标贴合、置信度、风险、冲突、资源压力、失败教训、惯性、时效
```

### 14.2 建木抽象联想链，而不是单层检索

GraphRAG 和向量 memory 解决“查到什么”。建木链路解决“应该怎么想”：

```text
概念 -> 一级联想 -> 抽象类型 -> 稳定规律 -> 工具层 -> 质量门 -> 返修
```

因此本系统不是 search-first，而是：

```text
route-first / abstraction-first / tool-governance-first
```

### 14.3 工程进度同步，而不是聊天记忆

记忆对象不是对话历史，而是工程现场：

```text
文件变化、任务阶段、工具调用、构建测试、失败原因、修复票据、质量报告、manifest
```

每次工程事件都会更新图谱关系和 FAMEEdgeState。

### 14.4 上下文健康是硬目标

系统不追求把更多东西塞进上下文，而是追求：

```text
用更少上下文做更准的路由和执行
```

解决问题后，完整 trace 进入日志；上下文只保留摘要、索引和下一次可用的教训。

## 15. 大图谱遍历效率设计

大项目图谱会爆炸，必须从第一版就做强 indexing + scoping。

### 15.1 Scope Key

所有节点、边、日志、摘要、FAME 状态都必须带 scope：

```yaml
scope:
  project_id: string
  workspace_id: string
  subject: string
  domain: string
  route_id: string
  task_id: string
  artifact_kind: string
  phase: discovery|design|implementation|test|review|delivery|maintenance
```

最小查询不得跨全图。默认查询边界：

```text
project_id + subject/domain + route_id/task_id
```

### 15.2 多级索引

建议建立 6 类索引：

```text
I1: project_id -> active tasks / files / routes
I2: subject/domain -> route_id shards
I3: route_id -> abstraction / tool / quality gate
I4: tool_id -> success/failure/fix history
I5: failure_category -> fix recipe / lesson summaries
I6: artifact_kind -> quality gates / reviewer / manifest schema
```

### 15.3 Route Shard

把知识网按 route shard 管理：

```text
subject/domain/route_id
```

每个 shard 只保留：

```text
route_summary
first_order_association_summary
abstraction_summary
tool_policy_summary
quality_gate_summary
recent_fame_edge_summary
```

原始全文按需展开。

### 15.4 Beam Traversal

遍历时不全图 BFS，而是 scope-gated beam search：

```text
候选路线 = scoped_index_lookup(query, project_id, subject, route_id)
每层只保留 top_k
遇到 high_delta/high_nu/high_lambda 进入审查，不继续深扩散
```

建议默认：

```yaml
traversal:
  route_top_k: 8
  abstraction_top_k: 3
  tool_top_k: 5
  lesson_top_k: 5
  max_hops_fast_path: 2
  max_hops_full_path: 5
  max_raw_logs_loaded: 3
```

### 15.5 Summary Cache

每个任务结束后生成三种摘要：

```text
route_summary：路线为什么这么走
failure_summary：失败、冲突、修复
context_summary：下一次进入上下文的最小信息
```

下次优先读 summary cache；只有 summary 的 kappa_eff 不足，才展开原始日志。

### 15.6 Tool Manual Lazy Loading

工具说明书也要纳入上下文健康策略：

```text
常驻：tool summary index
按需：完整 tool manual
执行后：ToolCallSummary
释放：manual full text / raw stdout
```

评估指标：

```text
tool_manual_context_cost
tool_arg_error_rate
manual_lookup_success_rate
```

## 16. 评估指标

系统必须用可量化指标证明价值。

### 16.1 工具成功率

```text
tool_success_rate = successful_tool_calls / total_tool_calls
```

按 scope 分组：

```text
project_id / tool_id / route_id / phase
```

目标：同类任务中持续上升。

### 16.2 失败复发率

```text
failure_recurrence_rate =
  repeated_failure_cases_with_same_category / total_failure_cases
```

目标：FAME lambda 和 fix ticket 生效后，同类失败复发下降。

### 16.3 上下文 token 节省

```text
context_token_saving =
  1 - tokens_used_with_scoped_summary / tokens_used_with_full_context
```

目标：在不降低成功率的情况下，明显减少上下文。

### 16.4 路由命中质量

```text
route_hit_quality =
  accepted_routes / proposed_routes
```

accepted 可由用户确认、工具成功、质量门通过共同判定。

### 16.5 质量门通过率

```text
quality_gate_pass_rate =
  artifacts_passed_review / artifacts_reviewed
```

按 artifact_kind 和 route_id 分组。

### 16.6 人工介入准确率

```text
human_gate_precision =
  necessary_human_confirmations / all_human_confirmations_triggered
```

目标：该停时能停，不该停时少打断。

### 16.7 FAME 预测校准

衡量 kappa_eff 是否真的预测成功：

```text
calibration_error =
  avg_bucket | predicted_success_probability - observed_success_rate |
```

其中 predicted_success_probability 可由：

```text
sigmoid(Score(route))
```

得到。

### 16.8 工程进度恢复效率

```text
resume_efficiency =
  time_to_reconstruct_task_state_from_summary / time_from_full_logs
```

目标：新会话或上下文清理后，能快速恢复任务状态。

### 16.9 探索收益率

```text
exploration_yield =
  useful_new_routes_or_fixes / high_chi_explorations
```

用于校准 `chi`，避免无意义发散。

### 16.10 工具参数错误率

```text
tool_arg_error_rate =
  tool_calls_failed_due_to_bad_args / total_tool_calls
```

目标：引入 Tool Manual Registry 后显著下降。

### 16.11 调度恢复成功率

```text
scheduler_resume_success_rate =
  resumed_tasks_completed / scheduled_resume_events
```

衡量 agent 时钟是否真的避免任务中断。

### 16.12 自我迭代收益

```text
self_iteration_yield =
  useful_policy_or_route_updates / reflection_cycles
```

用于避免无意义自我反思。

## 17. 完整系统评估设计

完整版也需要评估基线。建议用 A/B 对比：

```text
A: 普通 agent 工具调用
B: 建木路由 + FAMEEdgeState + scoped summary
```

任务集：

```text
代码读取任务
工具调用任务
失败修复任务
多步骤工程任务
文档/图表产物任务
```

采集：

```text
tool_success_rate
failure_recurrence_rate
context_tokens
route_hit_quality
quality_gate_pass_rate
manual_intervention_count
time_to_resume
```

## 18. 产品定位：Agent 万用外部插件

本项目最终定位为：

```text
FAME Knowledge Agent Gateway
= Agent 外脑
+ 知识网路由器
+ FAME 动态记忆层
+ 工具治理网关
+ 上下文健康管理器
+ 工程进度同步器
+ 可视化知识补充台
```

### 18.1 接入方式

```text
MCP Server：向 Claude/Codex/IDE agent 暴露 resources、tools、prompts。
HTTP API：给自研 agent、后台服务、web UI 调用。
CLI Adapter：给本地脚本和工程流水线调用。
IDE Adapter：给 VS Code/Cursor/JetBrains/Tauri shell 调用。
Workflow Adapter：给 LangGraph/Temporal/Inngest/Trigger.dev 调用。
```

### 18.2 外部插件边界

Agent 不直接管理知识网和工具细节，而是调用外部插件：

```text
agent asks:
  "我要完成这个任务，给我允许的路线、工具、上下文和约束。"

plugin returns:
  scoped route summary
  allowed tools
  required manuals
  FAME risk state
  quality gates
  approval requirements
```

工具执行仍经 Enforcement Kernel：

```text
Agent -> ProposedAction -> Plugin/Gateway -> ApprovedAction -> Tool
```

### 18.3 与普通 agent 插件的差异

普通插件提供能力：

```text
search / read file / call tool / store memory
```

本插件提供治理：

```text
该不该查
该查哪一层
该不该调工具
工具是否过期
上下文是否超载
失败是否复发
是否需要质量门
是否需要人工确认
```

## 19. 模块化与调试接口

每个模块都必须可单独测试、可解释、可回放。

### 19.1 标准模块接口

```yaml
ModuleDebugInterface:
  module_id: string
  health(): HealthReport
  explain(input): DecisionTrace
  dry_run(input): PlannedOutput
  run(input): Output
  replay(trace_id): ReplayResult
  metrics(): ModuleMetrics
  config_schema(): JsonSchema
```

### 19.2 必备调试能力

```text
health：模块是否可用、索引是否新鲜、依赖是否正常。
explain：为什么选这个 route/tool/quality gate。
dry-run：不执行工具，只展示将要执行什么。
replay：用旧 trace 复现一次决策链。
trace：记录输入、输出、耗时、FAME delta、阻断原因。
metrics：成功率、失败率、上下文消耗、延迟。
```

### 19.3 模块调试面板

```text
Knowledge Router Debug
  query -> route candidates -> abstraction -> selected route

FAME Debug
  edge -> old vector -> event delta -> new vector -> score

Tool Governance Debug
  ProposedAction -> checks -> ApprovedAction / blocked reason

Context Health Debug
  requested context -> selected summaries -> token estimate -> omitted refs

Scheduler Debug
  ClockEvent -> trigger -> resume context -> action result

Quality Gate Debug
  preview -> reviewer -> issues -> fix ticket -> re-review
```

可借鉴 OpenTelemetry trace、LangSmith/Langfuse/Phoenix 类观测、LangGraph checkpoint/replay、OPA decision log 的设计。

## 20. 知识网可视化和补充入口

知识网不能只靠文件编辑。需要一个可视化与补充台：

```text
Knowledge Workbench
```

### 20.1 可视化对象

```text
route_id
subject/domain
一级联想
抽象类型
工具层
质量门
FAMEEdgeState
失败教训
日志摘要
补充建议
```

### 20.2 图视图

```text
Route Graph：概念 -> 联想 -> 抽象 -> 工具 -> 质量门
FAME Heatmap：边的 mu/kappa/nu/delta/lambda 热力图
Project Overlay：当前项目正在使用哪些 route
Failure Map：高 lambda / 高 delta 的失败区域
Freshness View：过期知识和待验证路线
```

### 20.3 补充流程

```text
用户/agent 提出补充建议
-> 生成 KnowledgePatchProposal
-> 标注来源、scope、影响路线、FAME 初始值
-> preview diff
-> reviewer / human approval
-> 写入知识网或 sidecar patch
-> 更新索引和摘要
```

### 20.4 KnowledgePatchProposal

```yaml
KnowledgePatchProposal:
  proposal_id: string
  proposer: human|agent|scheduler
  target:
    route_id: string
    file_path: string
    section: string
  patch_type: add_route|edit_route|add_edge|update_tool_manual|add_lesson|deprecate_edge
  content_summary: string
  evidence_refs: list
  affected_edges: list
  initial_fame:
    mu: float
    chi: float
    epsilon: float
    kappa: float
    nu: float
    delta: float
    rho: float
    lambda: float
  review_status: proposed|approved|rejected|needs_revision
```

### 20.5 可借鉴技术

```text
Neo4j Bloom / GraphXR：图谱浏览和分析体验。
Cytoscape.js / React Flow / Sigma.js：web 端图谱可视化。
Arrows.app：图谱 schema 和关系图编辑体验。
OpenTelemetry / Phoenix / Langfuse：trace 和调试观测。
MCP Server：把知识网作为外部 agent 插件暴露。
OPA/Rego：补充和工具执行的 policy-as-code。
```

## 21. 联想机制与“找球门”遍历

本系统的图遍历不是全图漫游，而是围绕目标门进行 scoped traversal。

### 21.1 联想机制

联想分层：

```text
L0 用户意图联想
L1 route 一级联想
L2 抽象类型联想
L3 工具能力联想
L4 质量风险联想
L5 失败教训联想
L6 跨科目类比联想
```

候选来源：

```text
first_order_association.yaml
abstraction_to_expression.yaml
tool_capability_map.yaml
failure_summary
route_summary
FAME high-chi edges
历史成功路径
历史失败教训
```

联想必须经过：

```text
scope filter -> abstraction filter -> FAME score -> quality gate fit -> context budget fit -> permission check
```

### 21.2 找球门

“球门”是本轮任务的可交付目标门：

```yaml
GoalGate:
  goal_type: answer_question|choose_tool|fix_failure|generate_artifact|pass_quality_gate|update_knowledge|resume_project
  success_condition: string
  required_outputs: list
  quality_gates: list
  context_budget: int
```

遍历方式：

```text
Resolve Scope
-> Define GoalGate
-> Candidate Route Lookup
-> Association Expansion
-> Abstraction Filter
-> FAME Scoring
-> Context Cost Check
-> Tool / Quality Gate Check
-> Select GoalPath
-> Audit / Summary
```

路径评分：

```text
GoalPathScore =
  route_score
+ association_score
+ tool_fit
+ quality_gate_fit
+ freshness
- context_cost_penalty
- risk_penalty
- recurrence_penalty
```

可视化中，绿色表示选中路径，灰色表示剪枝，黄色表示可验证风险，红色表示冲突/权限阻断，紫色表示失败教训高，虚线表示 freshness 低。

## 22. 开工前文档对齐

本项目每次开始工作前必须先读取并对齐核心文档，详见：

```text
10_开工前文档对齐协议.md
```

最低要求：

```text
读主方案
读完整蓝图
读当前任务相关专题文档
定义 GoalGate
确认 scope
确认是否需要工具和 Enforcement Kernel
```

禁止直接依赖聊天记忆进行方案或工程改动。
