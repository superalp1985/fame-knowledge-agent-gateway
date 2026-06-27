# Contract Governance v0.1

## 目标
把协议冻结变成治理层，提供合同健康、系统门禁、版本变更提示、错误任务校验。

## 实现
```text
src/contract_governance.py
```

核心：
- `ContractGovernanceService`

## API
```text
GET /contracts/health
GET /contracts/gate
POST /contracts/{contract_name}/diff
```

## 能力

### 1. Contract Health
检查所有冻结合同：
- status 是否 frozen
- audit_stage 是否存在
- output_artifacts 是否存在

### 2. System Gate
合并 worker health 和 contract health，输出一个总门禁：
- `ok`
- worker_health
- contract_health
- blocking_issues

### 3. Contract Diff Hint
给定 proposed contract，提示：
- 是否需要 version bump
- 是否存在 breaking change
- 具体 changes
- 具体 breaking_changes

### 4. Error Task Contract Validation
如果 task 在 task store 中状态为 error，合同校验直接返回 error task 结果，不强行装作成功。

## 测试结果
```text
CONTRACT_HEALTH 200 True
CONTRACT_GATE 200 True
CONTRACT_DIFF 200 True True
```

## 说明
这是接真实 PPTAgent / PresentAgent-2 / Code2Video 之前的“冻结门禁”层。

## 下一步
1. 对 error task 的校验结果做专门展示。
2. 在 manifest/task detail 中增加 contract summary。
3. 把 contract gate 暴露给 Tauri UI 首页。
