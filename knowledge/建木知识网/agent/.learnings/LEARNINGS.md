
## [LRN-20260521-001] correction

**Logged**: 2026-05-21T21:39:00+08:00
**Priority**: medium
**Status**: applied
**Area**: backend

### Summary
WeaveMuse does not require MusicGen/Suno/local model backends; a multimodal cloud endpoint is sufficient.

### Details
User corrected the integration framing: WeaveMuse can work by handing its structured composition plan to a multimodal cloud API. MusicGen/Suno/local models should be described as optional backends, not prerequisites.

### Suggested Action
Keep WeaveMuse contracts backend-agnostic and prioritize `multimodal_cloud_endpoint` in docs/capability descriptions.

### Metadata
- Source: user_feedback
- Related Files: `src/adapters/weavemuse_worker.py`, `src/render_capabilities.py`, `src/gateway/main.py`
- Tags: weavemuse, multimodal-cloud, backend-contract

---
