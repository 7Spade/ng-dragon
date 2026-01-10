// Value-object exports for identity and workspace gating to reduce divergence across modules.
// Centralizes shared primitives (types, roles, module metadata) used by aggregates/events.
export * from './account-type';
export * from './workspace-type';
export * from './member-role';
export * from './module-types';
export * from './context-type';
export * from './container-scope';
export * from './actor-identity';
export * from './affected-entity';
export * from './causality-chain';
export * from './event-metadata';
