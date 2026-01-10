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
 * - Event Sourcing infrastructure (NEW - Phase 2)
 */

export * from './src/causality';
export * from './src/event-store';
export * from './src/aggregates';
export * from './src/projection';
export * from './src/value-objects';
export * from './src/ports';
export * from './src/mappers';
