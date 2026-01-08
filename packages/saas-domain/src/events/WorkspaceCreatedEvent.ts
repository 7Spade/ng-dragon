import { WorkspaceSnapshot } from '@account-domain';
import { DomainEvent } from '@account-domain';

export type WorkspaceCreatedEvent = DomainEvent<WorkspaceSnapshot>;
