# 建木知识网抽象层/规律层一阶联想设计 v0.1（2026-05-20）

## 目的

- 在“知识点层级化”之上，再补一层“抽象层 / 规律层”的一阶联想。
- 让 route 不只连到具体知识点，也能连到上位概念、规律族、题型规律和例外保护。
- 最终形成：语言树 → route → 一级联想 → 抽象层 → 规律层 → 学科层级节点。

## 产物

- 候选清单：`[REDACTED_LOCAL_PATH]`
- bridge草案：`[REDACTED_LOCAL_PATH]`

## 规则

- 抽象层优先承载“原理、机制、关系、本质、结构、框架、模型、体系、效应”等上位概念。
- 规律层优先承载“公式、定律、规则、制度、标准、比例、期限、条件、金额、税率”等可执行口径。
- 一级联想不再只表达同域相邻，而要区分：prerequisite / contrast / formula_neighbor / regulation_peer / question_peer / exception_peer。
- 题库异常一律进 exception，不进入通用规律层。

## 样板模块

- bridge.finance.capm.abstract_regularity: CAPM 是典型“抽象层→规律层→公式层”链路样板
- bridge.banking.risk.abstract_regularity: 银行类题的抽象层主要是风险管理框架，规律层主要是监管比例与流程顺序
- bridge.accounting.assets.abstract_regularity: 会计类题适合把“确认/计量/列报”作为抽象层，再落到具体规则层

## 观察

- 候选抽象/规律 route: 218
- 这不是重写知识网，而是把现有 route 的“上位概念”和“规律族”补出来。
- 后续可把样板模块扩成自动标注流程，但当前先只读旁路，不接判题主流程。