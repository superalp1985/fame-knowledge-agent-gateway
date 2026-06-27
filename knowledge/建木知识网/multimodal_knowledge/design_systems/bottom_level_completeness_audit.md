# 设计系统最下层知识点完整性审计清单

更新时间：2026-05-22 10:05 GMT+8

## 目的

本文件用于检查设计系统知识是否已经从抽象层、规律层、语义层落到底层可执行知识点。凡涉及 UI、PPT、报告版式、视频信息图、数据看板、视觉风格的输出，不能只停留在“克制、专业、现代、清晰”等粗词，必须落到本清单要求的最后一层。

## 1. 抽象层是否存在

- [设计系统审计-抽象层-信息层级]
  - 是否说明主次关系？
  - 是否说明注意力顺序？
  - 是否说明标题、正文、注释、图表之间的阅读路径？
  - 是否绑定字号差、字重差、对比差、位置优先级？

- [设计系统审计-抽象层-语义反馈]
  - 是否区分成功、风险、警告、禁用、进行中、重点操作？
  - 是否给每种语义绑定颜色 token？
  - 是否要求文字/图标冗余，避免只靠颜色？

- [设计系统审计-抽象层-品牌气质]
  - 是否把“克制/稳定/科技/温暖/活力/正式”转成 palette、radius、motion、accent area？
  - 是否限制强调色面积？
  - 是否说明禁用场景？

- [设计系统审计-抽象层-信息密度]
  - 是否区分数据密集、教学讲解、叙事展示、管理后台、视频大屏？
  - 是否绑定 grid columns、spacing scale、font scale、line-height？

## 2. 规律层是否存在

- [设计系统审计-规律层-层级规律]
  - 主标题字号必须大于正文至少 1 个 type step。
  - 结论块比证据块更突出，但不得遮挡证据。
  - 同页主视觉焦点不得超过 1 个；次焦点不得超过 2-3 个。

- [设计系统审计-规律层-间距规律]
  - 组间距必须大于组内距。
  - 页面边距、模块间距、卡片内距必须来自 4px/8px 系列或说明例外。
  - 表格/图表/卡片不能各自随机 padding。

- [设计系统审计-规律层-颜色规律]
  - neutral 承载主体，accent 承载强调，functional color 承载状态。
  - 高饱和色不能大面积铺底。
  - 风险/成功/警告必须配文本或图标。

- [设计系统审计-规律层-动效规律]
  - 100-200ms：轻反馈。
  - 250-400ms：中等状态变化。
  - 450-600ms：布局或段落变化。
  - 700-1000ms：章节级叙事。
  - 超过 1000ms 的交互动效默认不合格。

## 3. 语义树是否接上

必须存在并可读取：

```text
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
[REDACTED_LOCAL_PATH]
```

检查项目：

- 每个视觉任务是否从 `language_tree_route` 开始？
- 是否查 `first_order_association`？
- 是否查 `design_system_first_order_overlay`？
- 是否查 `design_system_semantic_tree`？
- 是否从 abstraction_layer 走到 system_layer、semantic_token_layer、modality_binding_layer、bottom_token_layer？
- 是否最后落到 token_name / numeric_value_or_hex / unit / source_system / semantic_role / modality / quality_gate？

## 4. 一级联想是否接上

设计系统一级联想覆盖表：

```text
[REDACTED_LOCAL_PATH]
```

必须满足：

- route 数 = 主语言树 route 数。
- complete_design_system_association = route 数。
- 每条 route 必须包含：
  - design_profile
  - abstraction_layer
  - recommended_systems
  - semantic_roles
  - modality_bindings
  - bottom_tokens
  - quality_gates

当前 2026-05-22 10:00 生成结果：

```text
ROUTES 2714
complete_design_system_association 2714
risk_control_compliance 242
finance_data_dashboard 326
formal_rule_explanation 268
process_system_mechanism 18
case_narrative_human 31
formal_teaching_default 1829
```

## 5. 最下层知识点是否够细

### 5.1 色彩 bottom token

[REDACTED]

- token [REDACTED] `Carbon blue60`、`Material primary40`、`Ant blue.primary`。
- hex：如 `#0f62fe`。
- 语义：primary_action / risk_error / warning_attention / formal_surface。
- 用途：按钮、标题、边框、背景、图表、状态。
- 禁用：不能只靠颜色传达；不能高饱和大面积铺底。

不合格示例：

```text
用蓝色突出重点。
```

合格示例：

```text
primary_action 使用 Carbon blue60 = #0f62fe；仅用于主按钮、当前步骤、高亮指标；单页强调面积 ≤ 15%。
```

### 5.2 字体 bottom token

[REDACTED]

- token [REDACTED]
- size px/rem。
- line-height px 或 ratio。
- weight。
- tracking/letter-spacing。
- 使用场景。

不合格示例：

```text
标题大一点，正文清晰。
```

合格示例：

```text
PPT 主标题使用 Material display-small：36px / 44px / weight regular / tracking 0；正文使用 body-large：16px / 24px / tracking 0.5px。
```

### 5.3 间距 bottom token

[REDACTED]

- spacing token。
- px/rem。
- 所属层级：页面边距、模块间距、组内距、卡片内距、表格内距。
- 关系：组间距 > 组内距。

合格示例：

```text
模块间距 Carbon spacing07 = 32px；卡片内距 spacing05 = 16px；标题与正文间距 spacing03 = 8px。
```

### 5.4 栅格 bottom token

[REDACTED]

- breakpoint。
- columns。
- margin。
- 适配场景。

合格示例：

```text
数据看板使用 Carbon lg breakpoint：1056px / 16 columns / 16px margin。
```

### 5.5 圆角 bottom token

[REDACTED]

- radius px。
- 使用对象。
- 语义。

合格示例：

```text
正式财务卡片使用 Material corner-small = 8px；状态 pill 使用 corner-full = 9999px。
```

### 5.6 动效 bottom token

[REDACTED]

- duration ms。
- easing curve。
- 语义目的。
- 触发条件。

合格示例：

```text
机制步骤 reveal 使用 300ms，easing = cubic-bezier(0.2,0,0,1)，用于说明流程推进，不用于装饰。
```

## 6. 当前不足与后续补充方向

当前已接上：

- Material 3 色彩、字体、圆角、动效。
- IBM Carbon 栅格、间距、字体、色彩。
- Ant Design 色彩、字体、企业中后台用色原则。
- Fluent 2 token [REDACTED]
- 2714 route 的 design system 一级联想 overlay。
- 设计系统语义树。
- 抽象规律到表达模式映射。

仍可继续补细：

- Material 3 component tokens：button、card、dialog、data-table、divider、FAB 等组件级 token。
- Carbon theme semantic tokens：background、layer、field、border、text、link、support、focus。
- Ant Design layout、motion、shadow 具体参数。
- Fluent 2 官方包中的具体 color / spacing / typography token [REDACTED]
- Apple HIG / Microsoft WinUI / GOV.UK / Atlassian / Shopify Polaris 等设计系统，可作为后续分支补充。

后续补充原则：

- 每新增一个设计系统，必须同时新增：
  - 来源记录。
  - 抽象层说明。
  - 语义层 token。
  - bottom token [REDACTED]
  - 建木场景映射。
  - 质量门禁。
  - 一级联想 overlay 或 overlay 生成规则。
