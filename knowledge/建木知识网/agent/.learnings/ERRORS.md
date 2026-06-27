
## [ERR-20260521-001] run_studio_src_import

**Logged**: 2026-05-21T21:35:00+08:00
**Priority**: medium
**Status**: pending
**Area**: infra

### Summary
`python scripts\run_studio.py` can fail with `ModuleNotFoundError: No module named 'src'` after service restart if project root is not on `PYTHONPATH`.

### Error
```text
ModuleNotFoundError: No module named 'src'
```

### Context
- Project: `[REDACTED_LOCAL_PATH]`
- Command attempted during Jianmu Agent Studio restart.
- TestClient imports worked from project root, but the script execution path put `scripts/` first.

### Suggested Fix
Add project root to `sys.path` inside `scripts/run_studio.py`, or start with `PYTHONPATH=.` / `$env:PYTHONPATH=(Get-Location).Path`.

### Metadata
- Reproducible: yes
- Related Files: `scripts/run_studio.py`

---
