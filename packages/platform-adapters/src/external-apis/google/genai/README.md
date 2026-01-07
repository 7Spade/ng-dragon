# Google GenAI Adapter (planned)

All Google GenAI / Vertex AI adapters live under `platform-adapters/src/external-apis/google/genai` to keep third-party SDKs in a single, predictable place.

- Runs in platform-adapters (never in `core-engine` or `saas-domain`).
- Wrap Google generative AI SDKs behind project-safe interfaces.
- Keep SDK usage isolated here; UI should consume through exported facades only.

Implementation will follow the causality + workspace-scoped event metadata described in `Mermaid.md`.
