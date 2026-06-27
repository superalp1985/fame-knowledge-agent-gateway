# 建木 FinEval 第二轮：计算模板与缺口扫描

日期：2026-05-15

## 用户补充要求

用户提醒：补好知识网之后，必须接回“让模型用建木方式过一遍所有知识”的轻量训练/复习阶段。

推理后端：Ollama 只是当前可用后端；如果不好用，可以换更稳定的本地推理软件。用户可协助下载。

已写入：

```text
memory/2026-05-15.md
[REDACTED_LOCAL_PATH]
```

## 本轮代码改动

文件：

```text
[REDACTED_LOCAL_PATH]
```

新增：

```text
detect_accounting_calc()
rule_choice_from_calc()
```

第一批会计计算模板：

```text
1. 无主要市场时的公允价值 / 最有利市场计算
2. 权益结算股份支付费用计算
3. 一揽子购入固定资产按公允价值比例分摊 + 安装成本
```

逻辑：

```text
如果计算模板能得出数值 → 直接与选项匹配 → decision_source=calc_rule
否则再交给 0.8B 选择
```

## 5题回归

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject accounting --limit 5 --out leaderboard_runs\round2_calc_accounting_val5.jsonl
```

结果：

```text
n=5
correct=3
accuracy=0.60
need_patch=0
```

相比第一轮：

```text
accuracy: 0.20 → 0.60
need_patch_rate: 0.40 → 0.00
```

说明计算模板对前 5 题有效。

## 20题缺口扫描

命令：

```bash
py -3.12 fineval_jianmu_pipeline.py --split val --subject accounting --limit 20 --out leaderboard_runs\round2_accounting_val20.jsonl
```

结果：

```text
n=20
correct=4
accuracy=0.20
need_patch=9
need_patch_rate=0.45
```

错误/缺口清单：

```text
[REDACTED_LOCAL_PATH]
```

## 暴露问题

### 1. 0.8B 仍有 A 选项偏置

非计算题大量输出 A，尤其是政府会计、无形资产、非营利组织、公允价值概念题。

### 2. 知识网覆盖不足或过粗

高频缺口：

```text
计量单元
市场参与者
政府会计
非营利组织会计
无形资产确认/摊销/处置
在建工程成本
投资性房地产减值与损益
长期分期付款现值入账
自建固定资产入账价值
```

### 3. 计算模板仍不足

需要补：

```text
自建生产线/设备入账价值
长期分期付款现值 + 必要税费
无形资产处置损益
投资性房地产利润影响
```

## 下一步建议

1. 先不急着全量跑，先补第二批计算模板。
2. 对概念题做“选项逐项评分/规则匹配”，减少 A 偏置。
3. 补 route_index/rules 节点：政府会计、无形资产、计量单元、市场参与者、非营利组织。
4. 补完后跑 accounting_val 20 题回归，看是否稳定超过 50%。
