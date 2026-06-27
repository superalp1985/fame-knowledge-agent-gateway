# 建木语言树/一级联想连接盘点 v0.1（2026-05-20）

## 产物

- 语言/入口/route连接清单：`[REDACTED_LOCAL_PATH]`
- 一级联想清单：`[REDACTED_LOCAL_PATH]`
- bridge草案：`[REDACTED_LOCAL_PATH]`
- 连接设计：`[REDACTED_LOCAL_PATH]`

## 统计

- lang/route association rows: 22
- first_order edges: 109
- bridge samples: 3

## first_order subject分布

- 经济学: 64
- 会计学: 28
- 法学: 6
- 保险精算: 4
- 统计学: 4
- 管理学: 3

## 观察

- 语言树到学科入口已有基础，但财经细分触发词仍偏粗，需要补到模块/上位概念级。
- first_order 已能表达同域相邻概念，但关系类型单一，后续应区分 prerequisite / contrast / formula_neighbor / regulation_peer / exception_peer。
- bridge 草案把 language trigger、route ids、first_order、hierarchy、guards 放到一条旁路记录里，适合后续作为泛化增强层。