# Securities Practitioner 抽象层补网报告 — 2026-05-19

## 本轮目标

在 `global_regression_20260518_after_economic_law_patch` 满分恢复点基础上，补 `securities_practitioner_qualification_certificate` 的证券法、证券公司合规、期货衍生品法稳定规则。

## 落地内容

- 补丁脚本：`[REDACTED_LOCAL_PATH]`
- 备份目录：`[REDACTED_LOCAL_PATH]`
- 修改文件：
  - `rules/法学_rules.json`
  - `route_index.json`
  - `associations/first_order_法学.json`
- 新增规则：13 条
- 新增 route：13 条，`route_index` 2651 → 2664
- 新增一级联想：3 条，`first_order_法学.json` 3 → 6

## 新增规则分组

### 证券法

1. 金融业对外开放原则
2. 公开发行证券人数边界
3. 擅自发行股票债券责任
4. 集资诈骗追诉标准
5. 上市公司收购公告要约义务罚则
6. 保荐代表人监管措施暂停受理
7. 证券服务机构承销期买卖限制
8. 证券交易所负责人任职限制

### 证券公司合规

1. 表外业务定义
2. 证券从业登记变更期限
3. 受托投资管理不得承诺收益
4. 合规管理人员兼职边界

### 期货与衍生品法

1. 期货和衍生品法施行日期

## 单科回归

- 输出：`[REDACTED_LOCAL_PATH]`
- 结果：22/22，accuracy=1.0
- need_patch：13/22

## 重要解释

本轮单科 `need_patch` 未下降，不代表补网无效。原因是本科残差几乎全部带数字、期限或金额，当前评估器逻辑为：

```python
if qtype == "calculation_or_amount" and not calc and re.search(r"\d", qblock):
    need_patch_reasons.append("calc_not_parsed")
```

因此即使知识网已经命中、κ 提升到 0.95，只要 `detect_and_calc` 没有返回计算结果，仍会保留 `calc_not_parsed`。本轮真实收益体现在：

- id=0/4/8 等原先 `no_knowledge_hit + low_kappa` 的证券监管题已被规则接住；
- 多数证券法/合规题 κ 提升到 0.95；
- 未改变正确率，单科保持满分。

## 全局回归

- 脚本：`[REDACTED_LOCAL_PATH]`
- 输出目录：`[REDACTED_LOCAL_PATH]`
- 状态：运行中，等待最终 34 科结果。

## 下一步建议

若全局回归仍为 34/34 perfect，则本轮封板。下一轮优先继续做概念型且外溢风险低的科目：

1. `macroeconomics`：31题，need_patch=14，但高比例是宏观计算模板；知识网已有旧补丁，可复查是否需要转解析器。
2. `futures_practitioner_qualification_certificate`：39题，need_patch=14，证券/期货规则可与本轮互补。
3. `accounting`：36题，need_patch=12，部分可能是会计概念/准则稳定模板。

暂不建议继续强打 `statistics` / `china_actuary` / `investments` / `tax_law` 顶部残差，因为它们主要是公式/计算解析器问题，不是知识网空洞。
