## [Unreleased] - 2026-01-17

### Changed
- Login route now resolves directly to `/login` with Material Design 3 UI.
- Removed demo login fallback; authentication now relies on Firebase auth state.
- Migrated codebase to DDD-aligned folders (`domain`, `application`, `infrastructure`, `presentation`, `shared`).
