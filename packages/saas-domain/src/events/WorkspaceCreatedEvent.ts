import { WorkspaceSnapshot, DomainEvent } from '@account-domain';

/**
 * Type alias for WorkspaceCreated event
 * Uses the DomainEvent pattern from account-domain
 */
export type WorkspaceCreatedEvent = DomainEvent<WorkspaceSnapshot>;
