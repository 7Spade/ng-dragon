/**
 * SaaS Domain
 *
 * 🏢 Pure TypeScript business domain models
 *
 * Contains domain logic for organization/workspace resources.
 *
 * Rules:
 * - Pure TypeScript only
 * - Can depend on @core-engine
 * - NO framework dependencies (Angular, Firebase, etc.)
 * - NO SDK dependencies
 */

export * from './src/value-objects/organization-roles';
export * from './src/events/domain-event';
export * from './src/events/organization-events';
export * from './src/events/in-memory-event-store';
export * from './src/aggregates/organization.aggregate';
export * from './src/repositories/organization-repository';
export * from './src/specifications/organization.specifications';
export * from './src/projections/organization-projector';
