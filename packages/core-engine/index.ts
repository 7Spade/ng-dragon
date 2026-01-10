/**
 * Core Engine
 *
 * Pure domain engine with ZERO framework dependencies
 *
 * Core Principles:
 * - NO Angular imports allowed
 * - NO Firebase imports allowed
 * - Pure TypeScript only
 * - Framework-agnostic domain logic
 *
 * This package intentionally exposes only abstract building blocks.
 * Domain-specific commands/handlers live in account-domain or saas-domain.
 */

export * from './src/ports';
export * from './src/queries';
export * from './src/mappers';
