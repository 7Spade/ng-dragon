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
 *
 * Contains:
 * - Event Store abstractions
 * - Causality tracking
 * - Aggregate Root patterns
 * - Projection (Read Model) definitions
 */


export * from './src/ports/workspace.repository.port';
export * from './src/commands/create-organization.command';
export * from './src/use-cases/create-organization.usecase';
