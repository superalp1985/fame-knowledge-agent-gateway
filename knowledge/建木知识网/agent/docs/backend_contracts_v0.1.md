# Backend Contracts v0.1

## 目标
冻结 adapter/worker/router 的输入输出协议，避免后续接真实 PPTAgent、PresentAgent-2、Code2Video、翻译模型时打散上游。

## 实现
```text
src/contracts.py
```

核心：
- `ContractSpec`
- `ContractRegistry`

## API
```text
GET /contracts
GET /contracts/{contract_name}
```

## 当前冻结合同
- `course-pack`
- `course-production`
- `ppt-draft`
- `video-plan`
- `animation-plan`
- `localization-package`
- `document-outline`

## 每个合同包含
- name
- version
- kind
- summary
- input_fields
- output_artifacts
- audit_stage
- status

## 原则
1. 上游只依赖 contract，不依赖具体 worker 实现。
2. 真实 worker 接入时，只替换 adapter 内部，不改 API contract。
3. 所有下游文字交接必须有 audit_stage。
4. v0.1 状态为 frozen，后续破坏性变更必须升版本。

## 测试结果
```text
CONTRACTS 200 7
CONTRACT_ONE 200 v0.1
```
