import { DomainEvent, WorkspaceSnapshot } from '@account-domain';

export type WorkspaceCreatedEvent = DomainEvent<WorkspaceSnapshot>;
