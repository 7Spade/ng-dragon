/**
 * SaaS Domain
 *
 * 🏢 Pure TypeScript business domain models
 *
 * Contains domain logic for:
 * - Workspace lifecycle
 *
 * Rules:
 * - Pure TypeScript only
 * - Can depend on @core-engine or @account-domain
 * - NO framework dependencies (Angular, Firebase, etc.)
 * - NO SDK dependencies
 */

export * from './src/commands/CreateOrganizationCommand';
export * from './src/application/WorkspaceApplicationService';
export * from './src/domain/WorkspaceFactory';
export * from './src/events/WorkspaceCreatedEvent';
export * from './src/repositories/WorkspaceRepository';
