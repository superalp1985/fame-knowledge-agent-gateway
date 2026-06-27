# Workbench v11：构建拆包与机制实机审计记录

日期：2026-06-27

## WorkStartAlignment

```yaml
project_positioning: Agent 万用外部插件 / 外脑运行时 / 工具治理网关
current_task: 解决 Vite 大 chunk 警告，进行实机测试，并审计当前机制是否完整
active_scope:
  project_id: fame-agent-gateway
  subject: workbench-runtime
  route_id: chunk-splitting-and-mechanism-audit
  task_id: workbench-v11-bundle-and-smoke
active_goal_gate:
  goal_type: pass_quality_gate
  success_condition: 构建无大 chunk 警告，3D/2D/Project Memory/Agent Runtime/GoalGate/Patch/Debug 机制实机通过
required_modules:
  - vite_bundle_policy
  - custom_3d_controls
  - project_memory_view
  - agent_runtime_view
  - goalgate_patch_debug_views
enforcement_required: true
context_budget_strategy: summary_first
```

## 修改内容

### 构建拆包

`vite.config.ts` 新增 `manualChunks`：

```text
vendor-react
vendor-flow
vendor-three-renderer
vendor-three-core
vendor-three-materials
vendor-three-geometry
vendor
```

原则：

```text
不通过调高 chunkSizeWarningLimit 消除警告。
优先拆分真实运行依赖。
知识网和项目记忆仍保持 runtime JSON 加载。
```

### 3D 控制器

`KnowledgeUniverse3D.tsx` 移除 `OrbitControls` 依赖，改为项目自有轻量控制器：

```text
left drag -> pan target
right drag -> rotate camera
wheel -> zoom
double click node -> 2D Detail
auto rotate -> false
```

运行时测试标记：

```text
data-pan-enabled=true
data-auto-rotate=false
data-control-mode=custom-left-pan-right-rotate
data-controls-target=x,y,z
```

## 构建验证

```text
npm run generate:project-memory: pass
npm run lint: pass
npm run build: pass
Vite large chunk warning: resolved
```

构建 chunk：

```text
index JS: 189.20 KB
vendor-three-renderer: 354.56 KB
vendor-three-core: 177.35 KB
vendor-react: 174.82 KB
vendor-flow: 125.60 KB
vendor: 71.49 KB
```

## 浏览器实机测试

### 3D Universe

```text
runtime index ready / 623 files: pass
projects 1 / pm edges 6: pass
canvas present: pass
data-control-mode=custom-left-pan-right-rotate: pass
left drag changes data-controls-target: pass
wheel zoom: pass
double click language tree center -> 2D Detail: pass
```

### Project Memory

```text
Project Memory active: pass
Core Knowledge Isolation visible: pass
Project FAME Overlay visible: pass
Core anchor visible: pass
Promotion anchor visible: pass
React Flow nodes: 10
React Flow edges: 6
```

### Search

```text
dev_server_port_in_use -> failure lesson: pass
5179/5180 fix recipe visible: pass
project-memory-overlay-policy -> promotion candidate: pass
core_write_allowed=false / needs review visible: pass
```

### Agent Runtime

```text
connectors MCP/HTTP/CLI/IDE/Workflow: pass
Thinking Pipeline: pass
Enforcement Preview ProposedAction/ApprovedAction: pass
Semantic Auto-Fit: pass
Context Pack retain/release: pass
```

### GoalGate / Patch / Debug

```text
GoalGate traversal kept/pruned path: pass
KnowledgePatchProposal presets and review boundary: pass
Module Debug health/dry-run/replay/metrics: pass
browser console errors: 0
browser console warnings: 0
```

## 机制完整性审计

当前已实现并实机可见：

```text
3D/2D 双层图谱
语言树中心与学科分片
搜索与 route_record 定位
负值 FAME 视觉规则
GoalGate 找球门遍历
KnowledgePatchProposal 图形化入口
2D 模块编辑草稿与 proposal 边界
Agent Runtime 外部插件视图
ProposedAction -> ApprovedAction 预览
Context Pack retain/release
Project Memory Overlay
Core read-only anchor
Promotion Candidate blocked until review
Module Debug health/dry-run/replay/metrics 展示
构建拆包与 chunk 健康
```

仍属于后续真实运行时层的必要功能：

```text
MCP Server 真正暴露 resources/tools/prompts
HTTP API 真正读写 ProjectMemoryGraph
Tool Gateway 自动写 tool_invocation_summary.jsonl
Enforcement Kernel 从预览升级为真实执行 gate
ClockEvent 调度器接入真实提醒/恢复
跨项目 promotion 统计
真实评估面板：tool_success_rate / context_token_saving / failure_recurrence
知识网补充 proposal 的持久化 review workflow
```

## WorkEndSummary

```yaml
files_changed:
  - workbench/vite.config.ts
  - workbench/src/KnowledgeUniverse3D.tsx
  - 方案设计/08_完整版实施蓝图.md
  - 方案设计/09_可视化工作台_联想机制_找球门遍历.md
  - 方案设计/22_Workbench_v11_构建拆包与机制实机审计记录.md
design_decisions:
  - 不用调高 warning limit 解决大 chunk，而是通过真实 manualChunks 拆包。
  - 3D 控制器改为项目自有实现，保留左键平移、右键旋转、滚轮缩放、双击下钻。
  - 机制审计区分“Workbench 可视化/预览已实现”和“后续真实运行时必须落地”。
diagrams_updated: []
unresolved_questions:
  - 下一步应优先做 MCP Server 真实插件接口，还是 Tool Gateway/Enforcement Kernel 真实执行链。
next_goal_gate: MCP/HTTP adapter prototype reads ProjectMemoryGraph and exposes GoalGate/ContextPack resources
context_release_summary: v11 已解决构建大 chunk 警告，并完成 3D/2D/Project Memory/Agent Runtime/GoalGate/Patch/Debug 实机测试。
```
