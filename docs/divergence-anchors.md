## PR #3 and #6 Divergence Anchors

These notes use Mermaid.md as the shared source of truth and capture the risk areas discussed across PR #3 (`copilot/create-file-tree-structure`) and PR #6 (`copilot/evaluate-discrepancies-in-mermaid`). A branch diff (`git diff origin/copilot/create-file-tree-structure..origin/copilot/evaluate-discrepancies-in-mermaid --stat`) shows no content differences; anchors below point to sections in Mermaid.md to avoid future drift.

### Comparison Snapshot
- Scope: PR #3 and PR #6 both touch Mermaid.md and the packages scaffold in `packages/`.
- Result: Mermaid.md content is identical between the two branches; no structural differences detected.

### Anchor Notes
- Identity vs Workspace boundary (see "Workspace / Account / Module Core" and Divergence Watchlist #1-#3): keep Actor (user|bot) distinct from Workspace, and ensure ACL lives on workspace/module checks instead of entities.
- Event metadata enforcement (see "Event Flow Overview" note and "Event Sourcing & Causality"): every DomainEvent carries workspaceId, moduleKey, actorId, causedBy/traceId, timestamp, payload; replay must verify workspace/module enablement first.
- Module gating before entity mutation (see "Module Boundary & Permissions"): operations should call `assertModuleEnabled()` prior to entity changes; entities stay data-only.
- Workspace-scoped session flow (see "Auth Chain & Session"): UI/adapters must force workspace selection and stamp workspaceId on queries and commands.
- Package layout expectations (see "Packages Directory Tree" and AGENTS.md): keep domain logic in account-domain/saas-domain, shared infrastructure in core-engine/platform-adapters, and UI concerns in ui-angular; reserved `@google/genai` adapter space should remain isolated from domain code.

### Follow-up Checklist
- When new PRs touch the diagrams or package layout, re-run the branch diff and update this file with any detected deltas.
- Keep Mermaid.md as the canonical visual; use this anchor file to summarize PR-specific outcomes and unresolved questions.
