/**
 * SaaS Domain
 *
 * 🏢 Pure TypeScript business domain models
 *
 * Contains domain logic for:
 * - Workspace lifecycle and organization management
 * - Team and partner management
 * - SaaS-specific business rules
 *
 * Rules:
 * - Pure TypeScript only
 * - Can depend on @account-domain
 * - NO framework dependencies (Angular, Firebase, etc.)
 * - NO SDK dependencies
 */

// Commands
export * from './src/commands/create-organization-command';
export * from './src/commands/create-team-command';

// Application Services
export * from './src/application/workspace-application-service';

// Domain Services & Factories
export * from './src/domain/workspace-factory';

// Events
export * from './src/events/WorkspaceCreatedEvent';

// Repositories (interfaces only - implementations in platform-adapters)
export * from './src/repositories/WorkspaceRepository';
