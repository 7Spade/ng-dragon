---
applyTo: ".copilot-tracking/changes/20260107-edge-ai-tracking-alignment-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: edge-ai tracking alignment

## Overview

Produce a phased, conflict-free alignment of .copilot-tracking workflow with edge-ai task collection guidance, ensuring unique filenames, correct applyTo/changes mapping, and VS Code visibility settings.

## Objectives

- Prevent naming or reference collisions between edge-ai-tracking-alignment artifacts and existing mermaid plan set
- Align plan/prompt/changes mapping and VS Code discovery settings for the edge-ai workflow

## Research Summary

### Project Files

- .copilot-tracking/research/20260107-edge-ai-tracking-compatibility-research.md - Compatibility guardrails, naming collision risks, applyTo alignment, success criteria
- .copilot-tracking/research/20260107-edge-ai-iterative-plan-research.md - Edge-ai iterative workflow, artifact generation, VS Code visibility settings
- .copilot-tracking/research/20260107-edge-ai-org-switcher-plan-research.md - Additional visibility guidance and workflow alignment examples

### External References

- #file:../research/20260107-edge-ai-tracking-compatibility-research.md - Research baseline for this slug
- #githubRepo:"7Spade/ng-dragon edge-ai task planner" - Pattern reference for edge-ai workflow (local instructions already present)
- #fetch:https://example.com/ - Not required; local collection provides needed specs

### Standards References

- #file:../../.github/instructions/task-implementation.instructions.md - Implementation process and tracking expectations
- #file:../../.github/collections/edge-ai-tasks.md - Edge-ai collection workflow, plan/prompt generation, VS Code visibility settings

## Implementation Checklist

### [x] Phase 1: Inventory and guardrails

- [x] Task 1.1: Validate existing .copilot-tracking assets and collision risks

  - Details: .copilot-tracking/details/20260107-edge-ai-tracking-alignment-details.md (Lines 11-27)

- [x] Task 1.2: Confirm research coverage for planning and implementation
  - Details: .copilot-tracking/details/20260107-edge-ai-tracking-alignment-details.md (Lines 28-44)

### [x] Phase 2: Plan and mapping alignment

- [x] Task 2.1: Ensure plan applyTo and changes file mapping is scoped to this slug
  - Details: .copilot-tracking/details/20260107-edge-ai-tracking-alignment-details.md (Lines 45-63)

### [x] Phase 3: VS Code visibility alignment

- [x] Task 3.1: Add or update chat visibility settings for plans and prompts
  - Details: .copilot-tracking/details/20260107-edge-ai-tracking-alignment-details.md (Lines 65-81)

### [x] Phase 4: Validation and change tracking

- [x] Task 4.1: Validate cross-references and update change log
  - Details: .copilot-tracking/details/20260107-edge-ai-tracking-alignment-details.md (Lines 83-101)

## Dependencies

- Edge-ai collection workflow and task-implementation instructions
- Write access to .vscode/settings.json for visibility updates

## Success Criteria

- Unique edge-ai-tracking-alignment artifacts with correct applyTo -> changes mapping
- VS Code configured to surface .copilot-tracking plans/prompts; cross-references validated and recorded in changes file
