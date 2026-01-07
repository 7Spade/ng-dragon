---
applyTo: ".copilot-tracking/changes/20260107-mermaid-file-tree-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Mermaid file tree diagram

## Overview
Add or adjust the Packages Directory Tree section in `docs/Mermaid.md`, keeping wording consistent with the existing Mermaid documentation set.

## Objectives

- Introduce或維持 `Packages Directory Tree` 區段於 Mermaid.md。
- 以 Mermaid flowchart 呈現 packages 目錄下的主要套件資料夾。

## Research Summary

### Project Files

- `docs/Mermaid.md` – 目前已包含 Packages Directory Tree 區塊（含 src/ 預留節點與 `platform-adapters/@google/genai` 子樹）。
- 分層與概念來源：`docs/Mermaid-A.md`、`docs/Mermaid-B.md`、`docs/Mermaid-C.md`、`docs/Mermaid-架構層.md`、`docs/Mermaid-基礎設施層.md`、`docs/Mermaid-概念層.md`、`docs/Mermaid-實作指引.md`、`docs/Mermaid-模組層.md`、`docs/Mermaid-總結層.md`。

### External References

- #file:../research/20260107-mermaid-file-tree-research.md - repo findings、套件列表與 Mermaid block 範例。
- #fetch:https://mermaid.js.org/syntax/flowchart.html - Mermaid flowchart syntax reference.

### Standards References

- #file:../../.github/instructions/markdown.instructions.md - markdown formatting expectations.

## Implementation Checklist

### [x] Phase 1: Add packages directory diagram

- [x] Task 1.1: Add new heading and context for the packages tree

  - Details: .copilot-tracking/details/20260107-mermaid-file-tree-details.md (Lines 11-26)

- [x] Task 1.2: Insert Mermaid flowchart for package folders
  - Details: .copilot-tracking/details/20260107-mermaid-file-tree-details.md (Lines 28-46)

### [x] Phase 2: Verify formatting references

- [x] Task 2.1: Confirm diagram syntax matches Mermaid documentation
  - Details: .copilot-tracking/details/20260107-mermaid-file-tree-details.md (Lines 48-61)

### [x] Phase 3: Prep Mermaid doc files for future development

- [x] Task 3.1: Ensure listed Mermaid docs exist with a one-line purpose comment
  - Details: .copilot-tracking/details/20260107-mermaid-file-tree-details.md (Lines 63-83)
- [x] Task 3.2: Remove or note any conflicting Mermaid artifacts blocking future implementation
  - Details: .copilot-tracking/details/20260107-mermaid-file-tree-details.md (Lines 85-94)

## Dependencies

- Mermaid flowchart syntax understanding
- Access to edit Mermaid.md and the referenced Mermaid layer docs for consistent terminology

## Success Criteria

- Mermaid.md contains a `Packages Directory Tree` section對齊內部用語，涵蓋主要套件資料夾（`account-domain`、`core-engine`、`platform-adapters`、`saas-domain`、`ui-angular`）。
- 若保留 src/ 或 `@google/genai` 子節點，維持現有層級與縮排，並符合 Mermaid 語法。
