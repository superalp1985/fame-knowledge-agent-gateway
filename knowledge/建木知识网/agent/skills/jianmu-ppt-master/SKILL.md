---
name: jianmu-ppt-master
description: Jianmu Agent Studio PPT production fallback skill. Use when building, repairing, reviewing, or improving PPT/courseware generation inside Jianmu Agent Studio, especially when PPTDraftWorker, pptxgenjs, Marp, PPTAgent, DeepPresenter, templates, slide quality gates, or presentation artifacts are involved. Jianmu knowledge network is authoritative; this skill is only a fallback craft/process guide.
---

# Jianmu PPT Master

## Authority Order

1. Jianmu Knowledge Network and project docs are authoritative.
2. Frozen contracts in `src/contracts.py`, module routing, task manifests, and quality gates are authoritative.
3. This skill is a fallback guide for PPT production technique only.
4. If this skill conflicts with Jianmu knowledge, follow Jianmu and note the conflict in the handoff/audit artifact.

## Core Workflow

For PPT generation inside Jianmu Agent Studio:

1. Preserve the current API contract: upstream sends `PptDraftRequest`; worker returns `TaskResult` artifacts.
2. Read the topic, audience, outline, speaker notes, and style from the request. Do not invent a new user-facing brief if the request already contains one.
3. Use Jianmu constraints from `build_prompt_constraints()` as hidden production constraints, not visible slide text.
4. Produce a useful local fallback even when external PPTAgent/DeepPresenter/cloud providers are unavailable.
5. Save both editable source and presentation artifact when possible:
   - `00_ppt_request.md`
   - `00_handoff_audit.json`
   - `04_ppt_draft.md`
   - `04_ppt_draft.pptx`
   - optional cloud request/response artifacts

## Slide Quality Rules

- One slide should carry one teaching job.
- Prefer title + 3 to 5 compact bullets, or title + one structured comparison/process/table.
- Avoid exposing worker names, routing internals, prompts, hidden constraints, or governance language in visible slides.
- Keep titles concrete and content-bearing.
- Use speaker notes as the main source for detailed teaching points.
- When source material is thin, create a conservative deck skeleton instead of fabricating facts.
- For official/course delivery, prioritize clarity, traceability, and editability over decorative visual complexity.

## Fallback Generation Pattern

When advanced workers are unavailable:

1. Convert outline headings into section slides.
2. Split speaker notes into up to 8 detail slides.
3. Export Marp markdown first.
4. Convert markdown to PPTX via the local Node/pptxgenjs script if available.
5. Record export errors as artifacts instead of failing silently.

## Conflict Handling

If PPT craft advice here conflicts with Jianmu assets, docs, route index, or quality gates:

- Use Jianmu's version.
- Keep the PPT artifact aligned with Jianmu.
- Add a short audit note explaining which fallback rule was overridden and why.

## Upgrade Path

PPTAgent, DeepPresenter, or any PPT-master-like external engine must remain behind the same worker contract:

```text
CourseProductionRouter -> PptDraftRequest -> audit -> PPT worker -> TaskResult artifacts
```

Only replace worker internals. Do not change the Gateway API, task manifest schema, or upstream course-production route just to fit an external engine.
