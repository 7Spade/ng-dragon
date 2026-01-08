import { WorkspaceSnapshot } from '@account-domain/src/aggregates/workspace.aggregate';
import { DomainEvent } from '@account-domain/src/events/domain-event';

export type WorkspaceCreatedEvent = DomainEvent<WorkspaceSnapshot>;
