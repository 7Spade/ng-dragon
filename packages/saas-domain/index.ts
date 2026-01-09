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

export * from './src/commands/create-organization-command';
export * from './src/application/workspace-application-service';
export * from './src/domain/workspace-factory';
export * from './src/events/WorkspaceCreatedEvent';
export * from './src/repositories/WorkspaceRepository';
export * from './src/aggregates/workspace.aggregate';
