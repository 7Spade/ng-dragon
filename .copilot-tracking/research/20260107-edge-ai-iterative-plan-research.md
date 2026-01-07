<!-- markdownlint-disable-file -->

# Task Research Notes: Edge AI task collection & iterative planning

## Research Executed

### File Analysis

- .github/collections/edge-ai-tasks.md
  - Describes edge-ai task collection: task-plan implementation instructions, task-planner agent, task-researcher agent, outputs (plan instructions, detail file, prompt, changes log) and usage guidance for iterative planning and implementation.

### Code Search Results

- "edge-ai" search
  - Scope limited to .github/collections; no additional in-code references identified for task automation.
- Additional searches
  - Not required; focus on planning workflow guidance.

### External Research

- #githubRepo:"7Spade/ng-dragon edge-ai task planner"  
  - Not executed; repo already includes collection instructions locally.
- #fetch:https://example.com/  
  - Not executed; no external docs needed beyond provided collection.

### Project Conventions

- Standards referenced: edge-ai task collection workflow (task-planner → plan/details/prompt files; task-implementation instructions; task-researcher agent), existing .copilot-tracking structure from prior research.
- Instructions followed: Collection usage guidance in .github/collections/edge-ai-tasks.md for generating plans and prompts, aligning with existing .copilot-tracking folders (plans, details, prompts, changes, research).

## Key Discoveries

### Project Structure

- Edge-ai workflow integrates with existing .copilot-tracking directories: research feeds task-planner agent, which emits plan instructions (.copilot-tracking/plans), details (.copilot-tracking/details), and implementation prompt (.copilot-tracking/prompts). Task-implementation instructions consume those artifacts to drive code changes.

### Implementation Patterns

- Iterative loop: research → plan via task-planner agent → refine plan → generate prompt for agent-mode implementation using task-implementation instructions. Plan is checklist-driven with phases/tasks; details file holds expanded guidance; prompt attaches plan to ensure context during implementation.

### Complete Examples

```markdown
#file: .copilot-tracking/research/*-research.md
# Use task-planner agent to build checklist
# Outputs:
#  - .copilot-tracking/plans/<task>-plan.instructions.md
#  - .copilot-tracking/details/<task>-details.md
#  - .copilot-tracking/prompts/implement-<task>.prompt.md
```

### API and Schema Documentation

- Not applicable; focus is on process artifacts: plan instructions schema (phase/task checklist), detail files (expanded steps), and implement prompts referencing task-implementation instructions.

### Configuration Examples

```json
// VS Code settings (from edge-ai collection usage)
{
  "chat.instructionsFilesLocations": {
    ".copilot-tracking/plans": true
  },
  "chat.promptFilesLocations": {
    ".copilot-tracking/prompts": true
  }
}
```

### Technical Requirements

- Use task-planner agent to convert research into actionable plan and prompt; attach research file(s) via #file directive.
- When implementing, run generated implement prompt in Agent mode (phaseStop/taskStop flags optional) to follow task-implementation instructions and produce changes log.

## Recommended Approach

Run the edge-ai task-planner agent with current research (#file: .copilot-tracking/research/20260107-skeleton-baseline-research.md) to generate a phase/task checklist plan, details file, and implement prompt. Iterate until the plan matches desired scope, then execute the implement prompt (agent mode) so task-implementation instructions drive changes and change-tracking.

## Implementation Guidance

- **Objectives**: Turn existing skeleton baseline research into an actionable plan using edge-ai task-planner; ensure artifacts (plan, details, prompt) live under .copilot-tracking for downstream execution.
- **Key Tasks**: Invoke task-planner agent with relevant research files; review and refine generated plan; ensure implement prompt points to task-implementation instructions; store artifacts in .copilot-tracking/plans, /details, /prompts.
- **Dependencies**: edge-ai task collection; existing research file (.copilot-tracking/research/20260107-skeleton-baseline-research.md); VS Code settings pointing to plans/prompts locations if used locally.
- **Success Criteria**: Plan checklist produced with phases/tasks aligned to skeleton goals, matching detail file; implement prompt available for agent execution; artifacts saved in .copilot-tracking and ready for task-implementation workflow.
