<!-- markdownlint-disable-file -->
# Release Changes: edge-ai tracking alignment

**Related Plan**: .copilot-tracking/plans/20260107-edge-ai-tracking-alignment-plan.instructions.md
**Implementation Date**: 2026-01-07

## Summary
Prepared a conflict-free edge-ai planning set by adding a compatibility research note, generating a dedicated plan/details/prompt trio, and updating VS Code chat visibility settings for .copilot-tracking assets.

## Changes

### Added

- .copilot-tracking/research/20260107-edge-ai-tracking-compatibility-research.md - consolidated edge-ai collection guardrails and collision checks
- .copilot-tracking/plans/20260107-edge-ai-tracking-alignment-plan.instructions.md - phased checklist for aligning .copilot-tracking with edge-ai workflow
- .copilot-tracking/details/20260107-edge-ai-tracking-alignment-details.md - task-level guidance covering guardrails, mappings, settings, and validation
- .copilot-tracking/prompts/implement-edge-ai-tracking-alignment.prompt.md - implementation driver for the new plan with self-cleanup steps
- .copilot-tracking/changes/20260107-edge-ai-tracking-alignment-changes.md - change log for this alignment set

### Modified

- .vscode/settings.json - added chat instructions/prompt locations to surface .copilot-tracking plans and prompts

### Removed

- None.

## Release Summary

**Total Files Affected**: 6

### Files Created (5)

- .copilot-tracking/research/20260107-edge-ai-tracking-compatibility-research.md - edge-ai compatibility research
- .copilot-tracking/plans/20260107-edge-ai-tracking-alignment-plan.instructions.md - alignment plan
- .copilot-tracking/details/20260107-edge-ai-tracking-alignment-details.md - alignment task details
- .copilot-tracking/prompts/implement-edge-ai-tracking-alignment.prompt.md - alignment implement prompt
- .copilot-tracking/changes/20260107-edge-ai-tracking-alignment-changes.md - this change log

### Files Modified (1)

- .vscode/settings.json - chat discovery settings updated for .copilot-tracking assets

### Files Removed (0)

- None

### Dependencies & Infrastructure

- **New Dependencies**: None
- **Updated Dependencies**: None
- **Infrastructure Changes**: None
- **Configuration Updates**: Added chat instructions/prompt locations in VS Code settings

### Deployment Notes

- Documentation and settings-only changes; no runtime impact.
