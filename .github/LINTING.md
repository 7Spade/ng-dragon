# Local linting and Codacy checks

To avoid lockfile errors like `This package doesn't seem to be present in your lockfile`, run lint inside an environment where dependencies are installed:

1. Install deps once per clone: `yarn install --immutable`.
2. Run lint: `yarn lint` (or use the VS Code task "lint").
3. Codacy CLI: ensure the Codacy MCP server is available, then run `codacy-cli analyze` from repo root after install.

In devcontainers, dependencies install automatically via `postCreateCommand`; re-run `yarn install --immutable` if packages change.
