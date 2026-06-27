# 工具感知推理与组织器原则

更新时间：2026-05-25

## 0. 核心定位

Jianmu Studio 不是多 agent 平台优先，也不是再造一个大模型。

它的核心定位是：

```text
本地知识网驱动的万能 AI 组织器
```

它组织：

- 用户意图
- 本地知识网
- 抽象规律
- 工具能力
- AI 输出
- worker 执行
- reviewer 审查
- auto-fix 返修
- artifact 交付
- memory / manifest / logs

因此，多 agent 只是可选执行单元；工具、知识、结构、质量门才是主干。

## 1. Agent 的两项核心职责

Agent 的主要职责只有两类：

1. 调取工具。
2. 组织 AI 输出结果。

工具负责确定性执行，AI 负责生成与推理，知识网负责约束方向，组织器负责把三者接成可交付流程。

```text
用户意图
-> 建木组织器
-> 知识网定位
-> 抽象/规律判断
-> 工具选择
-> 产物结构
-> AI/worker 执行
-> reviewer 审查
-> auto-fix 修正
-> final 输出
```

## 2. 工具层

工具层回答“这一步应该由什么能力完成”。

工具不是外部附属按钮，而是知识网的一层。任何工具调用都应从知识结构推导，而不是由模型随意选择。

### 2.1 工具类型

| 工具类型 | 作用 | 典型任务 |
| --- | --- | --- |
| 文件工具 | 读取/写入/归档/产物组织 | 文档、manifest、日志、记忆 |
| 检索工具 | 查找本地知识/网页/资料 | source、route、evidence |
| 浏览器工具 | 网页交互/截图/可视验证 | 登录态页面、视觉检查 |
| 执行工具 | 跑脚本、测试、构建、worker | smoke、render、export |
| 多媒体工具 | 图像/音频/视频生成或处理 | PPT、配音、视频、图表 |
| 审查工具 | reviewer、lint、quality gate | 溢出、事实、来源、节奏 |
| 通信工具 | 汇报、发送、提醒 | 进度同步、交付通知 |
| 调度工具 | cron、queue、background task | 长任务、定时检查、异步执行 |

### 2.2 工具选择原则

工具选择必须满足：

1. 先知识路由，再工具选择。
2. 先确定性工具，后生成式模型。
3. 先轻量检查，后重型 worker。
4. 先 preview，后 review，再 final。
5. 工具失败必须转成 issue / fix ticket / log，而不是静默忽略。
6. 外部工具不得绕过本地数据边界和质量门。

### 2.3 工具调用不等于权限放开

工具层只定义“应该怎么做”，不等于自动允许执行。

需要用户确认或显式 gate 的操作仍必须等待确认：

- 外发消息。
- 修改主 OpenClaw。
- 启动/停止 Gateway。
- 调用真实模型。
- 大规模删除/迁移。
- 任何可能越过本地数据边界的外部写入。

## 3. 算力梯度

算力梯度回答“这个任务值得用多少资源”。

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

### L0 直接回答

适用：普通概念解释、简短问答、无需产物。

要求：

- 不进入 full path。
- 不生成 artifact package。
- 不调用重 worker。

### L1 本地知识检索

适用：需要引用建木知识网，但不需要正式交付物。

要求：

- 读取 route / hierarchy / relevant docs。
- 输出简洁答案或方向建议。

### L2 结构化推理

适用：需要整理框架、方案、提纲，但尚未确认正式生产。

要求：

- 仍属于 chat-first discovery。
- 可形成 task spec 草案。
- 不直接进 final。

### L3 工具辅助生成

适用：用户确认需要草稿或 preview。

要求：

- 进入 confirmed task spec。
- 使用 production harness。
- 写 manifest。

### L4 worker 渲染/导出

适用：PPT、PDF、视频、音频、图像、图表等需要实际产物。

要求：

- worker 走 sandbox。
- 输出 preview。
- 保留 source / logs / artifacts。

### L5 reviewer 审查

适用：preview 已生成，需要判断是否可交付。

要求：

- 读取 reviewer_registry。
- 生成 review_result。
- 不通过则不能 final。

### L6 auto-fix / rerun

适用：review 失败但可自动修复。

要求：

- 生成 auto_fix_ticket。
- 执行修复。
- 重新 review。

### L7 多轮复审 / 人工确认

适用：高风险、对外、正式、复杂交付。

要求：

- 必须保留审查链。
- 需要人工确认时停下来。

## 4. 推理梯度

推理梯度回答“这个任务需要多深的思考”。

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

### R0 意图识别

判断用户是闲聊、问答、探索、正式产物、还是系统维护。

### R1 概念定位

定位 subject / domain / route / keywords。

### R2 抽象归类

判断主抽象类型：定义、分类、流程、对比、风险、因果、时间、数据等。

### R3 规律匹配

匹配知识优先、结构优先、叙事优先、质量门优先等硬规律。

### R4 模态规划

决定文本、PPT、视频、图表、音乐、音频、设计系统等表达组合。

### R5 工具编排

决定用哪些工具、先后顺序、失败后的降级路径。

### R6 质量预测

在生成前预测可能失败点：乱码、溢出、遮挡、证据不足、图文不符、音画不同步。

### R7 返修策略

把失败点映射到 auto-fix recipe 和 work order。

### R8 交付治理

决定 preview/final、manifest、logs、memory、review run、用户确认。

## 5. 拓扑复杂度

Jianmu Studio 的复杂度不来自“很多 agent”，而来自知识与工具之间的拓扑连接。

### 5.1 线性路径

适用普通问答：

```text
用户问题 -> fast answer
```

### 5.2 树状路径

适用结构化解释：

```text
概念
-> 抽象类型
-> 表达模式
-> 例子/反例
```

### 5.3 图状路径

适用正式产物：

```text
概念 route
<-> 一级联想
<-> 抽象层
<-> 领域默认
<-> 设计系统 token
[REDACTED] 工具/worker
<-> artifact manifest
<-> reviewer
<-> auto-fix
```

### 5.4 闭环路径

适用高质量交付：

```text
preview
-> review
-> issue
-> fix ticket
-> revised preview
-> review run
-> final decision
```

拓扑越复杂，越需要 manifest、日志、质量门和人工确认。

## 6. 与现有工作流的关系

本文件不改变现有入口工作流。

仍然保持：

```text
普通问答 -> fast path
成品任务 -> chat-first discovery
用户确认 -> confirmed task spec
正式生产 -> full path
未审查 -> preview
真实通过 -> final
```

工具层、算力梯度、推理梯度只负责让 full path 更稳，不把普通聊天变重。

## 7. 最小调用规则

Agent 在思考时按以下最小规则执行：

1. 先判断是否需要进入更高算力梯度。
2. 若不需要，停在 fast path。
3. 若需要产物，先形成 confirmed task spec。
4. 进入 full path 后，读取知识层级与工具层。
5. 每个工具调用必须有目的、输入、输出、失败处理。
6. 每个 artifact 必须有 manifest。
7. 每个 preview 必须经过 reviewer 才能考虑 final。
8. 每轮结束保存状态、日志和记忆。

## 8. 后续细化方向

- 将具体工具映射到 artifact type。
- 将 reviewer 映射到 failure category。
- 将算力梯度写入 task envelope。
- 将推理梯度写入 prompt pack。
- 将拓扑节点写入 manifest，方便复盘和审计。
