# 建木知识网 Phase 1 接线与测试报告

日期：2026-05-15

## 目标
完成 `PROJECT_PLAN_0.6B_JIANMU.md` 中第一阶段：

1. 先把知识网建好；
2. 与建木 router 连接；
3. 建立固定测试闭环；
4. 为后续 0.6B 本体训练准备第一版 SFT 数据。

## 本次新增/修改文件

- `build_route_index.py`
- `route_index.json`
- `eval/eval_jianmu_core_50.json`
- `test_phase1_routes.py`
- `build_sft_dataset.py`
- `training_data/jianmu_phase1_sft.jsonl`
- `summarize_phase1_generation.py`
- `reports/phase1_route_test_report.json`
- `reports/phase1_generation_quality.md`
- `reports/phase1_jianmu_connection_report.md`
- 修改：`router.py`

## 已完成内容

### 1. 路由索引层
新增 `route_index.json`：

- 总路由条目：2285
- 手工高优先级概念：11
- 自动抽取 neurons/rules：2274

手工高优先级概念包括：

- NPV / 净现值
- IRR / 内部收益率
- WACC
- 借贷记账法
- 会计分录
- 固定资产折旧方法
- 收入确认五步法
- 合并财务报表
- 增值税一般纳税人与小规模纳税人
- 审计风险模型
- 勾股定理

每个手工概念包含：

- aliases
- keywords
- negative_keywords
- content
- priority

用于解决 NPV 串到三角函数、折旧方法乱编、勾股定理串到动能定理等问题。

### 2. router.py 接线
`KnowledgeNet` 新增：

- `self.route_index`
- `_load_all()` 自动加载 `route_index.json`
- `search_route_index(query, max_results)`

`JianMuRouter.route()` 改为：

```text
route_index 高精度命中
+ legacy search_neurons 兜底
+ 去重
+ context hygiene 过滤 FinEval 填空题/过长题干噪声
+ build_narrative
```

返回结果新增：

- `route_index_hits`
- `matched_aliases`

### 3. 计算器增强
`detect_and_calc()` 新增中文平方表达：

```text
5的平方加12的平方 → 5²+12²=169
```

原 NPV 计算保持可用。

### 4. 固定测试集
新增 `eval/eval_jianmu_core_50.json`：

- 前 13 条为核心手工测试：会计、财务、审计、数学、计算
- 后续从 `reports/sample_questions.json` 扩展到 50 条

### 5. 路由测试脚本
新增 `test_phase1_routes.py`。

支持：

```bash
python test_phase1_routes.py --no-llm --limit 50
python test_phase1_routes.py --limit 20
```

`--no-llm` 模式不依赖 Ollama，只测试：

```text
问题 → route_index/neuron/rule → narrative/calculation
```

### 6. 测试结果
确定性测试命令：

```bash
python -m py_compile router.py test_phase1_routes.py build_route_index.py build_sft_dataset.py
python test_phase1_routes.py --no-llm --limit 50
```

结果：

```text
total=50
ok=50
ok_rate=100.00%
route_ok=50
calc_ok=50
```

端到端 Ollama 测试：

当前 Ollama 可用模型：`qwen2.5:3b-instruct-q4_K_M`。本轮临时将 `router.py` 的 `MODEL` 改为该模型并跑：

```bash
python test_phase1_routes.py --limit 20
python summarize_phase1_generation.py
```

结果：

```text
total=20
ok=20
ok_rate=100.00%
route_ok=20
calc_ok=20
elapsed_s≈20.15
flagged_cases=1
```

端到端生成质量从初次测试的 `flagged_cases=13/20` 降到 `1/20`。主要修复手段：

- 过滤含 `____` 的 FinEval 填空题噪声；
- route_index 命中后减少 legacy noisy context；
- 降低温度到 0.35；
- prompt 从“不超过5段”改为“不超过3段，优先120-220字”；
- 输出长度硬限制从 600 字缩到 450 字。

当前唯一 flag：`合并财务报表为什么要抵销内部交易` 回答略长，但内容方向正确。

### 7. 第一版 SFT 数据
新增 `build_sft_dataset.py`，生成：

`training_data/jianmu_phase1_sft.jsonl`

当前样本数：354

包含三类：

1. `narrative_sft`：问题 + 建木知识叙事 → 答案
2. `concept_sft`：概念解释样本
3. `anti_hallucination`：反串域 / 反幻觉样本

## 当前限制

1. PowerShell/终端编码显示乱码，但文件内容以 UTF-8 正常写入。
2. 当前端到端测试用的是 `qwen2.5:3b-instruct-q4_K_M`，不是 0.6B；Ollama 当前没有 `jianmu:latest`。
3. 0.6B 本体训练还未开始；本阶段只完成知识网接线、路由质量、测试闭环和训练数据初版。

## 下一步建议

1. 若要固定 0.6B 端到端生成，需把 Qwen3-0.6B Ollama 模型注册为 `jianmu:latest` 或修改 `MODEL`。
2. 第二阶段进入 `JianMu-0.6B-S4Body`：使用 `training_data/jianmu_phase1_sft.jsonl` 做受控本体可塑训练。
3. 训练前可继续扩充 route_index 的 aliases / negative_keywords，并把 flagged generation 样本回灌到 anti_hallucination 数据中。


## 2026-05-15 19:58 模型切换记录

用户已在 Ollama 下载 `qwen3.5:0.8b`，后续项目口径从 0.6B 改为 0.8B，其它路线不变。

Ollama 当前模型：

```text
qwen3.5:0.8b  parameter_size=873.44M  quantization=Q8_0
qwen2.5:3b-instruct-q4_K_M
```

已修改 `router.py`：

```python
MODEL = "qwen3.5:0.8b"
```

重新跑端到端测试：

```bash
python -m py_compile router.py test_phase1_routes.py build_route_index.py build_sft_dataset.py summarize_phase1_generation.py
python test_phase1_routes.py --limit 20
python summarize_phase1_generation.py
```

结果：

```text
total=20
ok=20
ok_rate=100.00%
route_ok=20
calc_ok=20
elapsed_s≈54.78
flagged_cases=0
```

结论：`qwen3.5:0.8b` 与当前建木知识网接线兼容，端到端 20 条核心测试全部通过，自动质量复盘无 flagged case。下一阶段按 `JianMu-0.8B-S4Body` 继续。
