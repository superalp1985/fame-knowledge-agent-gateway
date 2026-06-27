# FinEval × 建木第三轮：第二批计算模板

日期：2026-05-15

## 用户补充

用户告知：

```text
[REDACTED_LOCAL_PATH]
```

策略：当前先不切换后端以免打断主线；若 Ollama 继续拖累格式控制或推理稳定性，再接入该 llama 后端。

已同步到：

```text
memory/2026-05-15.md
[REDACTED_LOCAL_PATH]
```

## 本轮代码改动

文件：

```text
[REDACTED_LOCAL_PATH]
```

在 `detect_accounting_calc()` 中新增第二批计算模板：

```text
1. 自建生产线/设备入账价值
2. 长期分期付款购买无形资产：现值 + 必要税费/注册费
3. 无形资产处置损益
4. 成本模式投资性房地产利润影响
```

## 回归结果

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject accounting --limit 20 --out leaderboard_runs\round3_calc_accounting_val20.jsonl
```

结果：

```text
n=20
correct=6
accuracy=0.30
need_patch=5
need_patch_rate=0.25
```

对比第二轮：

```text
accuracy: 0.20 → 0.30
need_patch_rate: 0.45 → 0.25
```

具体改善：

```text
id=5 自建生产线入账价值：A→B，命中正确
id=15 无形资产处置损益：A→B，命中正确
```

仍未解决：

```text
id=6 自建设备入账价值模板未完全匹配，仍 A/B 错
id=16 投资性房地产利润影响模板得出 700，但 gold=C 900；需要复核题目规则或模板
```

## 当前判断

计算器路线继续有效：只要模板覆盖到，0.8B 的 A 偏置可以被程序规则绕开。

当前瓶颈已从“能不能算”转向：

```text
1. 概念/准则题知识网细化不足
2. 非计算题仍 A 偏置
3. 部分计算题规则需复核（投资性房地产利润影响等）
```

## 下一步建议

1. 先做非计算题“选项逐项评分/关键词规则”以压 A 偏置。
2. 补概念规则节点：计量单元、市场参与者、政府会计、非营利组织、无形资产。
3. 修正 id=6/id=16 两个模板边界。
4. 跑 accounting_val 前20题目标：稳定 >50%。
