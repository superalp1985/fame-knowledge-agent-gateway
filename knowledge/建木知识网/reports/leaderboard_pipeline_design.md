# 建木 × FinEval / 上财公开榜答题管线设计

日期：2026-05-15

## 目标

用 `Qwen3.5-0.8B + 建木知识网 + Python 计算器` 在 FinEval / 上财公开榜拿到可提交名次。

本阶段不再继续追训练 loss，核心转向真实端到端答题。

## 总体策略

```text
轻量内化 + 外部知识网 + Python 工具答题
```

分工：

```text
0.8B 模型：理解题目、识别题型、组织证据链、选择答案
建木知识网：知识、规则、案例、公式、术语解释
Python 计算器：数值计算、公式代入、四舍五入、单位换算
```

## 为什么这样做

0.8B 参数量有限，不适合强行硬记全部金融/会计知识。正确用法是让模型先用建木方式过一遍知识，形成：

```text
领域术语印象
题型印象
规则调用习惯
选项排除格式
```

正式答题时，不依赖裸模型记忆，而依赖建木知识网和计算工具。

## 答题主流程

```text
FinEval 题目 + A/B/C/D 选项
→ 题型识别：概念 / 准则 / 分录 / 计算 / 案例判断
→ 建木 route_index / rules / neurons 检索
→ 组装 narrative 证据链
→ 如涉及数字/公式，调用 Python 计算器
→ 0.8B 基于证据链选择 A/B/C/D
→ 输出 answer / confidence / evidence / need_patch
```

## need_patch 机制

以下情况标记 `need_patch=true`：

```text
1. 建木知识网无命中或 κ < 0.35
2. 命中主题与题目明显不一致
3. 题目包含专业术语但 narrative 为空
4. 涉及数字计算但 Python 未识别可计算表达式
5. 模型输出不是 A/B/C/D
```

`need_patch` 题目进入补网队列。补网不得只停留在题目级规则，必须同时检查三层：

```text
1. 直接规则/计算模板：解决当前题型
2. 抽象层节点：补概念定义、准则边界、会计处理原则
3. 一级联想路由：补 route_index / associations，让相关问法能路由到正确抽象节点
```

联想硬约束：

```text
每题最多 3 次联想 / 最多展开 3 个联想节点
不允许递归发散
超过 3 个候选时按 route score / priority 截断
```

闭环：

```text
错题/低置信 → 提取知识点 → 补 entries/rules/neurons/route_index/associations → 重跑
```

## 三阶段实施

### Stage A：管线骨架

- 读取 FinEval academic dev/val/test CSV
- 统一题目格式
- 调用建木 router
- 调用 Python calculator
- 输出 JSONL 轨迹
- 支持 dry-run / limit

### Stage B：知识复习/轻量内化

让 0.8B 先“过一遍知识”，但不是硬背。该阶段必须放在第一轮补网闭环之后执行：先用 val 暴露缺口、补 entries/rules/neurons/route_index，再把补好的知识网转成建木式复习数据，让模型形成领域印象、题型感和证据链调用习惯。

输入来源：

```text
entries / rules / neurons / route_index / need_patch 错题补网结果
```

生成材料：

```text
知识点 → 问答
规则 → 选择题解释
公式 → 计算例题
错题 → 依据链
```

目标：让模型熟悉建木语气、领域术语和答题格式。

### Stage C：公开榜提交

- 对 val 做闭环补网
- 对 test 生成全量预测
- 格式校验
- 抽样人工核对
- 提交公开榜

## 对比基线

必须保留：

```text
裸 qwen3.5:0.8b
qwen3.5:0.8b + 建木 route/router
训练 state + 建木 route/router（备选）
```

最终采用真实 val/test 表现最好的路线，不为机制炫技牺牲榜单分数。

## 推理后端策略

Ollama 是当前可用后端，但不是绑定选择。如果继续出现 MCQ 输出字段不稳定、thinking/response 分裂、stop token [REDACTED]

```text
[REDACTED_LOCAL_PATH]
llama.cpp / LM Studio / transformers 直跑 / vLLM
```

后端切换不改变主线：建木知识网 + Python 计算器 + 小模型证据链选择。

## 第一轮实现文件

```text
[REDACTED_LOCAL_PATH]
```

输出目录：

```text
[REDACTED_LOCAL_PATH]
```

默认先跑 val/dev 小样本，确认输出轨迹正确后再跑全量。
