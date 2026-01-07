# Google GenAI Adapter (planned)

This folder reserves space for Google GenAI / Vertex AI adapters under `@platform-adapters/@google/genai`.

- Runs in platform-adapters (never in `core-engine` or `saas-domain`).
- Intended to wrap Google generative AI SDKs behind project-safe interfaces.
- Keep SDK usage isolated here; UI should consume through exported facades only.

Implementation will follow the causality + workspace-scoped event metadata described in `Mermaid.md`.
