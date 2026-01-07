<!-- markdownlint-disable-file -->

# Task Research Notes: edge-ai task collection compatibility for .copilot-tracking

## Research Executed

### File Analysis

- .github/collections/edge-ai-tasks.md  
  - Defines the edge-ai workflow (research → task-planner → plan/details/prompt → implementation via task-implementation instructions) and VS Code settings for surfacing generated assets under `.copilot-tracking/`.
- .copilot-tracking/*  
  - Current assets are limited to the mermaid file tree set (plan/details/prompt/changes) plus several research notes (edge-ai iterative plan, org switcher planning, skeleton baseline). No other plan sets exist, so new plans must avoid name collisions with `20260107-mermaid-file-tree-*`.
- .copilot-tracking/changes/20260107-mermaid-file-tree-changes.md  
  - Shows expected change-log structure (summary + Added/Modified/Removed + release summary) for documentation-only updates.

### Code/Search Notes

- Directory listing confirms five `.copilot-tracking/` subfolders (changes/details/plans/prompts/research) with only one plan set in `plans/`.  
- No other references to edge-ai tasks beyond the collection doc and research notes; compatibility concerns are limited to naming collisions and keeping prompts aligned to their plan.

### Project Conventions

- Plan sets use date-prefixed filenames (e.g., `20260107-<topic>-plan.instructions.md`) with matching details, research, prompt, and changes files.  
- Task-implementation instructions expect `applyTo` in the plan to target the corresponding changes file.  
- Implement prompts reference the plan, details, and research via `#file:` directives and should request cleanup of the prompt after completion.  
- VS Code settings should include `.copilot-tracking/plans` and `.copilot-tracking/prompts` so newly generated assets are discoverable (per collection doc).

## Key Discoveries

### Compatibility / Conflict Risks

- **Naming collisions**: Only one plan exists; ensure new plan/detail/prompt/changes filenames are unique (e.g., include topic slug `edge-ai-tracking-alignment`).  
- **ApplyTo alignment**: Plan `applyTo` must point to its dedicated changes file to avoid accidental reuse of the mermaid change log.  
- **Prompt references**: Implement prompts must reference the correct plan/detail/research files; avoid reusing mermaid prompt paths.  
- **Settings visibility**: Without the VS Code settings from the collection, new plans/prompts might be undiscoverable, leading to duplicate ad-hoc files.

### Iterative Flow (from edge-ai collection)

1) Gather or update research under `.copilot-tracking/research/*.md`.  
2) Run **task-planner** (collection agent) with `#file:` refs to research to generate plan + details + implement prompt under `.copilot-tracking/`.  
3) Execute implement prompt in Agent mode (optionally `phaseStop`/`taskStop`) to apply **task-implementation.instructions.md** and produce/update the dedicated changes file.  
4) Iterate: refine research → regenerate plan/prompt if scope changes; keep filenames stable per topic to avoid fragmentation.

## Recommended Approach

- Create a new plan set named `20260107-edge-ai-tracking-alignment-*` grounded in this research.  
- Ensure plan `applyTo` points to `changes/20260107-edge-ai-tracking-alignment-changes.md`.  
- Use task-planner with #file references to this research and prior edge-ai iterative/org-switcher research notes to maintain consistency.  
- Include a step to add VS Code `chat.instructionsFilesLocations` and `chat.promptFilesLocations` entries if missing, so new assets are discoverable and do not conflict with existing files.  
- Keep prompts configured to delete themselves post-implementation to reduce clutter and collision risk.

## Success Criteria

- Research consolidated for the new topic with explicit compatibility guardrails.  
- Generated plan/details/prompt use unique filenames and correct cross-references.  
- Changes file scoped to the new plan to prevent overlap with the mermaid change log.  
- Iteration steps documented to allow safe regeneration without conflicts.
