/**
 * Core Engine
 *
 * 💎 Pure domain core with ZERO framework dependencies
 *
 * Core Principles:
 * - NO Angular imports allowed
 * - NO Firebase imports allowed
 * - Pure TypeScript only
 * - Framework-agnostic domain logic
 */

// Explicit re-exports for consumers; keep paths to real source files only.
export * from './src/commands/create-organization.command';
export * from './src/commands/create-team.command';
export * from './src/use-cases/create-organization.usecase';
export * from './src/use-cases/create-team.usecase';
export * from './src/ports/workspace.repository.port';
