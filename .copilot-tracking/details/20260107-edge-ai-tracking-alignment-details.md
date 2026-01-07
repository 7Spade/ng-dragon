<!-- markdownlint-disable-file -->

# Task Details: edge-ai tracking alignment

## Research Reference

**Source Research**: #file:../research/20260107-edge-ai-tracking-compatibility-research.md

## Phase 1: Inventory and guardrails

### Task 1.1: Validate existing .copilot-tracking assets and collision risks

Confirm current plan/detail/prompt sets and ensure the new edge-ai-tracking-alignment slug stays unique relative to existing mermaid artifacts.

- **Files**:
  - .copilot-tracking/plans - inspect for existing plan filenames
  - .copilot-tracking/details - inspect for matching detail files
  - .copilot-tracking/prompts - inspect for existing implement prompts
- **Success**:
  - Unique slug `edge-ai-tracking-alignment` chosen with no collisions against mermaid set
  - Inventory documented for reference in change log
- **Research References**:
  - #file:../research/20260107-edge-ai-tracking-compatibility-research.md (Lines 9-35) - current inventory, naming collision risk, applyTo/prompt alignment requirements
  - #file:../research/20260107-edge-ai-iterative-plan-research.md (Lines 35-52) - iterative workflow and artifact expectations
- **Dependencies**:
  - None

### Task 1.2: Confirm research coverage for planning and implementation

Verify all relevant research inputs are attached (compatibility, iterative workflow, org-switcher visibility guidance) before any implementation steps proceed.

- **Files**:
  - .copilot-tracking/research/20260107-edge-ai-tracking-compatibility-research.md
  - .copilot-tracking/research/20260107-edge-ai-iterative-plan-research.md
  - .copilot-tracking/research/20260107-edge-ai-org-switcher-plan-research.md
- **Success**:
  - Research set verified and referenced in plan/prompt
  - No missing research files blocking implementation
- **Research References**:
  - #file:../research/20260107-edge-ai-tracking-compatibility-research.md (Lines 37-50) - iterative flow and recommended approach for this slug
  - #file:../research/20260107-edge-ai-org-switcher-plan-research.md (Lines 43-53, 94-113) - visibility requirements and workflow alignment
- **Dependencies**:
  - Task 1.1 completion

## Phase 2: Plan and mapping alignment

### Task 2.1: Ensure plan applyTo and changes file mapping is scoped to this slug

Create or confirm the dedicated changes file path and update plan `applyTo` plus prompt references so they target the edge-ai-tracking-alignment set only.

- **Files**:
  - .copilot-tracking/plans/20260107-edge-ai-tracking-alignment-plan.instructions.md
  - .copilot-tracking/changes/20260107-edge-ai-tracking-alignment-changes.md
  - .copilot-tracking/prompts/implement-edge-ai-tracking-alignment.prompt.md
- **Success**:
  - Plan `applyTo` points to the slug-specific changes file
  - Implement prompt references the correct plan, details, and research files for this slug and includes self-cleanup note
  - Changes file exists or is created as part of implementation
- **Research References**:
  - #file:../research/20260107-edge-ai-tracking-compatibility-research.md (Lines 32-48, 54-57) - applyTo alignment, unique filenames, success criteria
  - #file:../research/20260107-edge-ai-iterative-plan-research.md (Lines 35-52, 70-74) - artifact generation pattern and implementation flow
- **Dependencies**:
  - Phase 1 completion

## Phase 3: VS Code visibility alignment

### Task 3.1: Add or update chat visibility settings for plans and prompts

Update .vscode/settings.json to include chat instructions/prompt locations so the new plan and prompt are discoverable in VS Code per edge-ai collection guidance.

- **Files**:
  - .vscode/settings.json
- **Success**:
  - `chat.instructionsFilesLocations` includes `.copilot-tracking/plans`
  - `chat.promptFilesLocations` includes `.copilot-tracking/prompts`
  - Existing settings remain intact (formatting, code actions, associations)
- **Research References**:
  - #file:../research/20260107-edge-ai-iterative-plan-research.md (Lines 59-67, 71-74) - required VS Code settings and workflow usage
  - #file:../research/20260107-edge-ai-org-switcher-plan-research.md (Lines 52-55) - visibility requirements for generated assets
- **Dependencies**:
  - Phase 2 completion

## Phase 4: Validation and change tracking

### Task 4.1: Validate cross-references and update change log

Confirm cross-file references (plan/details/prompt/research) are correct, filenames are unique, and update the slug-specific changes file with the alignment steps performed.

- **Files**:
  - .copilot-tracking/plans/20260107-edge-ai-tracking-alignment-plan.instructions.md
  - .copilot-tracking/details/20260107-edge-ai-tracking-alignment-details.md
  - .copilot-tracking/prompts/implement-edge-ai-tracking-alignment.prompt.md
  - .copilot-tracking/changes/20260107-edge-ai-tracking-alignment-changes.md
- **Success**:
  - All references resolve to this slug’s artifacts without pointing to mermaid files
  - Changes file documents Added/Modified/Removed entries for settings and planning assets
  - Ready for future implementation iterations without conflicts
- **Research References**:
  - #file:../research/20260107-edge-ai-tracking-compatibility-research.md (Lines 45-57) - recommended approach and success criteria
- **Dependencies**:
  - Phase 3 completion

## Dependencies

- Edge-ai collection workflow and task-implementation instructions

## Success Criteria

- All tasks executed without naming collisions, with correct applyTo/changes mapping, and updated VS Code visibility
- Plan, details, prompt, research, and changes files remain aligned for the edge-ai-tracking-alignment slug
